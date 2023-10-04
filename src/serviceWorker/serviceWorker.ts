import RuleService from 'services/RuleService';
import StorageService from 'services/StorageService';
import BSService from 'services/BrowserSupportService';
import InjectCodeService from 'services/InjectCodeService';
import BaseService from 'services/BaseService';
import MatcherService from 'services/MatcherService';
import config from 'options/formBuilder/config';
import handleError from './errorHandler';
import { ListenerType } from 'services/ListenerService/ListenerService';
import { PostMessageAction } from 'models/postMessageActionModel';
import { IRuleMetaData, PageType } from 'models/formFieldModel';
import { StorageKey } from 'models/storageModel';
import { UNINSTALL_URL, EXCLUDED_URLS } from 'options/constant';
import { throttle } from 'src/utils/throttle';
import 'services/WebRequestService';
import Rule = chrome.declarativeNetRequest.Rule;
import MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL = chrome.declarativeNetRequest.MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL;
import GETMATCHEDRULES_QUOTA_INTERVAL = chrome.declarativeNetRequest.GETMATCHEDRULES_QUOTA_INTERVAL;


class ServiceWorker extends BaseService {
  throttleUpdateMatchedRulesTimestamp: Function;
  constructor() {
    super();
    this.registerListener();
    const delay = GETMATCHEDRULES_QUOTA_INTERVAL * 60 * 1000 / MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL;
    this.throttleUpdateMatchedRulesTimestamp = throttle(this.updateMatchedRulesTimestamp, delay);
    chrome.runtime.setUninstallURL(UNINSTALL_URL);
  };

  async registerListener (): Promise<void> {
    this.addListener(ListenerType.ON_INSTALL, this.onInstalled)
    .addListener(ListenerType.ON_MESSAGE, this.onMessage)
    .addListener(ListenerType.ON_MESSAGE_EXTERNAL, this.onMessage)
    .addListener(ListenerType.ON_UPDATE_TAB, this.onUpdatedTab);
  };

  onMessage = (request, _, sendResponse): void => {
    const { action, data } = request;
    (async () => {
      let responseData: any;
      try {
        if(action === PostMessageAction.GetStorageRules) {
          responseData = this.getStorageRules();
        } else if(action === PostMessageAction.GetRule) {
          responseData = this.getRule(data);
        } else if(action === PostMessageAction.AddRule) {
          responseData = this.addRule(data);
        } else if(action === PostMessageAction.UpdateRule) {
          responseData = this.updateRule(data);
        } else if(action === PostMessageAction.DeleteRules) {
          responseData = this.deleteRules();
        } else if(action === PostMessageAction.DeleteRule) {
          responseData = this.deleteRule(data);
        } else if(action === PostMessageAction.GetUserId) {
          responseData = this.getUserId();
        } else if(action === PostMessageAction.ChangeRuleStatusById) {
          responseData = this.changeRuleStatusById(data);
        } else if(action === PostMessageAction.CopyRuleById) {
          responseData = this.copyRuleById(data);
        } else if(action === PostMessageAction.UpdateTimestamp) {
          responseData = StorageService.updateTimestamp(String(data.ruleMetaData.id), data.timestamp);
        } else if(action === PostMessageAction.ExportRules) {
          responseData = this.exportRules();
        } else if(action === PostMessageAction.ImportRules) {
          responseData = this.importRules(data);
        }
        sendResponse(await responseData);
      } catch (error: any) {
        const { version } = chrome.runtime.getManifest();
        // hot fix for unique id
        if(error.message.includes('does not have a unique ID')) {
          const ID: number = await StorageService.getSingleItem(StorageKey.NEXT_ID) || 1;
          StorageService.set({[StorageKey.NEXT_ID]: ID + 50 });
          sendResponse(await this.addRule(data));
          error.message = 'handled error ID'
          handleError(error, {action: PostMessageAction[action], data: {...data, version}})
          return;
        }
        sendResponse({error: true, info: handleError(error, {action: PostMessageAction[action], data: {...data, version}})})
      }
    })();
  };

  onInstalled = async () => {
    // temp function
    StorageService.remove(StorageKey.CONFIG);
    // Temp function
    // Add 'resourceTypes' to local storage rules
    const ruleMetaData = await StorageService.getRules();
    ruleMetaData.forEach(async (item: IRuleMetaData) => {
      if(!item.resourceTypes) {
        item.resourceTypes = [];
        await StorageService.set({[item.id as number]: item});
      }
      const { version } = chrome.runtime.getManifest();
      if(version === '1.0.35') {
        item.lastMatchedTimestamp = item.timestamp as number;
        delete item.timestamp;
        await StorageService.set({[item.id as number]: item});
      }
    })
  }

  onUpdatedTab = (tabId, changeInfo, tab): void => {
    this.injectContentScript(tabId, changeInfo, tab);
    this.getMatchedRules(tab);
  }

  getMatchedRules = async (tab) => {
    if(tab.status === 'complete') {
      const enabledRules: IRuleMetaData[] = await StorageService.getFilteredRules([{key: 'enabled', value: true}]);
      const isUrlsMatch = enabledRules.some(rule => MatcherService.isUrlsMatch(rule.source, tab.url, rule.matchType));
      const hasRedirectRule = enabledRules.some((rule: IRuleMetaData) => (
        rule.pageType === PageType.REDIRECT && rule.destination ||
        rule.pageType === PageType.MODIFY_RESPONSE));
      if(enabledRules.length && (isUrlsMatch || hasRedirectRule)) {
        this.throttleUpdateMatchedRulesTimestamp();
      }
    }
  }

  updateMatchedRulesTimestamp = async (): Promise<void> => {
    try {
      const matchedRules = await RuleService.getMatchedRules();
      matchedRules.rulesMatchedInfo.forEach(({ rule, timeStamp }) => {
        StorageService.updateTimestamp(String(rule.ruleId), timeStamp);
      });
    } catch (error) {}
  }

  injectContentScript = async (tabId, _, tab) => {
    const isUrlExluded: boolean = EXCLUDED_URLS.some(url => tab.url?.startsWith(url));
    const filters = [{key: 'pageType', value: PageType.MODIFY_REQUEST_BODY}, {key: 'enabled', value: true}];
    const rules: IRuleMetaData[] = await StorageService.getFilteredRules(filters);
    if (!BSService.isSupportScripting() || isUrlExluded || !rules.length) return;
    InjectCodeService.injectContentScript(tabId, rules);
  };

  async getRule(data): Promise<any> {
    const ruleMetaData = await StorageService.get(String(data.id));
    return {ruleMetaData: ruleMetaData[data.id]};
  }

  async addRule({rule, ruleMetaData}: { rule?, ruleMetaData: IRuleMetaData }): Promise<IRuleMetaData> {
    const id: number = await StorageService.generateNextId();
    if(rule && ruleMetaData.enabled) {
      await RuleService.set([{...rule, id}]);
    }
    await StorageService.set({[id]: { ...ruleMetaData, id }});
    return { ...ruleMetaData, id };
  }
  
  async updateRule({rule, ruleMetaData}): Promise<IRuleMetaData> {
    if(rule && ruleMetaData.enabled) {
      await RuleService.set([rule], [rule])
    }
    await StorageService.set({[ruleMetaData.id]: ruleMetaData});
    return ruleMetaData;
  }

  async getStorageRules(): Promise<IRuleMetaData[]> {
    return await StorageService.getRules();
  }

  async deleteRules(): Promise<void> {
    await RuleService.clear();
    await StorageService.clear();
  }

  async deleteRule(data): Promise<void> {
    await RuleService.removeById(data.id);
    await StorageService.remove(String(data.id));
  }

  async getUserId(): Promise<{[key: string]: number}> {
    return {[StorageKey.USER_ID]: await StorageService.getUserId()};
  }

  async changeRuleStatusById({ id, checked }: {id: number, checked: boolean}): Promise<void> {
    const ruleMetaData: IRuleMetaData = await StorageService.getSingleItem(String(id));
    if(checked) {
      if(ruleMetaData.pageType !== PageType.MODIFY_REQUEST_BODY) {
        const rule: Rule = config[ruleMetaData.pageType].generateRule(ruleMetaData);
        await RuleService.set([{...rule, id}])
      }
    } else {
      await RuleService.removeById(id);
    }
    await StorageService.set({[id]: {...ruleMetaData, enabled: checked }});  
  }

  async copyRuleById({ id }: {id: number}): Promise<void> {
    const copyOriginalRule = await StorageService.getSingleItem(String(id));
    copyOriginalRule.name += ' copy';
    copyOriginalRule.lastMatchedTimestamp = null;
    await this.addRule({ruleMetaData: copyOriginalRule});
  }

  async exportRules(): Promise<Omit<IRuleMetaData, 'id'>[]> {
    const storageRules: IRuleMetaData[] = await StorageService.getRules();
    return storageRules.map((rule: IRuleMetaData) => {
      const { id, ...restObject } = rule;
      restObject.lastMatchedTimestamp = null;
      return restObject;
    })
  }

  async importRules(ruleMetaData: Omit<IRuleMetaData, 'id' >[]): Promise<void> {
    for(let i = 0; i < ruleMetaData.length; i++) {
      try {
        const rule: Omit<IRuleMetaData, 'id' > = ruleMetaData[i];
        await this.addRule({
          rule: config[rule.pageType].generateRule(rule),
          ruleMetaData: ruleMetaData[i] as IRuleMetaData
        });
      } catch (error) {}
    }
  }
}

new ServiceWorker();