import RuleService from 'services/RuleService';
import StorageService from 'services/StorageService';
import BSService from 'services/BrowserSupportService';
import InjectCodeService from 'services/InjectCodeService';
import BaseService from 'services/BaseService';
import MatcherService from 'src/services/MatcherService';
import config from 'src/options/formBuilder/config';
import { ListenerType } from 'services/ListenerService/ListenerService';
import { PostMessageAction } from 'models/postMessageActionModel';
import { IRuleData, PageType } from 'models/formFieldModel';
import { StorageKey } from 'models/storageModel';
import { excludedUrls } from 'options/constant';
import handleError from './errorHandler';
import 'services/WebRequestService';
import Rule = chrome.declarativeNetRequest.Rule;

class ServiceWorker extends BaseService {
  constructor() {
    super();
    this.registerListener();
  };

  async registerListener (): Promise<void> {
    this.addListener(ListenerType.ON_INSTALL, this.onInstalled)
    .addListener(ListenerType.ON_MESSAGE, this.onMessage)
    .addListener(ListenerType.ON_MESSAGE_EXTERNAL, this.onMessage)
    .addListener(ListenerType.ON_UPDATE_TAB, this.onUpdatedTab);
  };

  onInstalled = async () => {
    // temp function
    StorageService.remove(StorageKey.CONFIG);
    // Temp function
    // Add 'resourceTypes' to local storage rules
    const ruleData = await StorageService.getRules();
    ruleData.forEach(async (item: IRuleData) => {
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
      const enabledRules = await StorageService.getFilteredRules([{key: 'enabled', value: true}]);
      const isUrlsMatch = enabledRules.some(rule => MatcherService.isUrlsMatch(rule.source, tab.url, rule.matchType));
      if(enabledRules.length && isUrlsMatch) {
        try {
          const matchedRules = await RuleService.getMatchedRules();
          matchedRules.rulesMatchedInfo.forEach((ruleInfo) => {
            const { rule, timeStamp } = ruleInfo;
            StorageService.updateTimestamp(String(rule.ruleId), timeStamp);
          });
        } catch (error) {}
      }
    }
  }

  injectContentScript = async (tabId, _, tab) => {
    const isUrlExluded: boolean = excludedUrls.some(url => tab.url?.startsWith(url));
    const filters = [{key: 'pageType', value: PageType.MODIFY_REQUEST_BODY}, {key: 'enabled', value: true}];
    const rules: IRuleData[] = await StorageService.getFilteredRules(filters);
    if (!BSService.isSupportScripting() && isUrlExluded && rules.length) return;
    InjectCodeService.injectContentScript(tabId, rules);
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
          responseData = StorageService.updateTimestamp(String(data.matchedRule.id), data.timestamp);
        }
        sendResponse(await responseData);
      } catch (error: any) {
        const { version } = chrome.runtime.getManifest();
        sendResponse({error: true, info: handleError(error, {action: PostMessageAction[action], data: {...data, version}})})
      }
    })();
  };

  async getRule(data): Promise<any> {
    const ruleData = await StorageService.get(String(data.id));
    return {ruleData: ruleData[data.id]};
  }

  async addRule({rule, ruleData}: { rule?, ruleData: IRuleData }): Promise<void> {
    const id: number = await StorageService.generateNextId();
    await StorageService.set({[StorageKey.NEXT_ID]: id});
    if(rule && ruleData.enabled) {
      await RuleService.set([{...rule, id}]);
    }
    if(!ruleData.enabled && ruleData.rule) {
      ruleData.rule.id = id;
    }
    await StorageService.set({[id]: { ...ruleData, id }});
    
  }
  
  async updateRule({rule, ruleData}): Promise<void> {
    if(rule && ruleData.enabled) {
      await RuleService.set([rule], [rule])
    }
    await StorageService.set({[ruleData.id]: ruleData});
  }

  async getStorageRules(): Promise<IRuleData[]> {
    return await StorageService.getRules();
  }

  async deleteRules(): Promise<void> {
    await RuleService.remove(await RuleService.get());
    (await StorageService.getRules()).map(({id}) => StorageService.remove(String(id)));
  }

  async deleteRule(data): Promise<void> {
    await RuleService.removeById(data.id);
    await StorageService.remove(String(data.id));
  }

  async getUserId(): Promise<{[key: string]: number}> {
    return {[StorageKey.USER_ID]: await StorageService.getUserId()};
  }

  async changeRuleStatusById({ id, checked }: {id: number, checked: boolean}): Promise<void> {
    const ruleData = await StorageService.getSingleItem(String(id));
    if(checked) {
      if(ruleData.pageType !== PageType.MODIFY_REQUEST_BODY) {
        const rule: Rule = config[ruleData.pageType].generateRule(ruleData);
        await RuleService.set([{...rule, id}])
      }
    } else {
      await RuleService.removeById(id);
    }
    await StorageService.set({[id]: {...ruleData, enabled: checked }});
  }

  async copyRuleById({ id }: {id: number}): Promise<void> {
    const copyOriginalRule = await StorageService.getSingleItem(String(id));
    copyOriginalRule.name += ' copy';
    await this.addRule({ruleData: copyOriginalRule});
  }
}

new ServiceWorker();