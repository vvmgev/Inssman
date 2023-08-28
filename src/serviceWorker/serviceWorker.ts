import RuleService from 'services/RuleService';
import StorageService from 'services/StorageService';
import BSService from 'services/BrowserSupportService';
import InjectCodeService from 'services/InjectCodeService';
import BaseService from 'services/BaseService';
import MatcherService from 'src/services/MatcherService';
import config from 'src/options/formBuilder/config';
import handleError from './errorHandler';
import { ListenerType } from 'services/ListenerService/ListenerService';
import { PostMessageAction } from 'models/postMessageActionModel';
import { IForm, IRuleMetaData, PageType } from 'models/formFieldModel';
import { StorageKey } from 'models/storageModel';
import { excludedUrls } from 'options/constant';
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
      // need to implement debounce function instead of this checks
      const hasRedirectRule = enabledRules.some((rule: IRuleMetaData) => (
        rule.pageType === PageType.REDIRECT && rule.destination ||
        rule.pageType === PageType.MODIFY_RESPONSE
      ));
      if(enabledRules.length && (isUrlsMatch || hasRedirectRule)) {
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
    const rules: IRuleMetaData[] = await StorageService.getFilteredRules(filters);
    if (!BSService.isSupportScripting() && isUrlExluded && rules.length) return;
    InjectCodeService.injectContentScript(tabId, rules);
  };

  async getRule(data): Promise<any> {
    const ruleMetaData = await StorageService.get(String(data.id));
    return {ruleMetaData: ruleMetaData[data.id]};
  }

  async addRule({rule, ruleMetaData}: { rule?, ruleMetaData: IRuleMetaData }): Promise<void> {
    const id: number = await StorageService.generateNextId();
    if(rule && ruleMetaData.enabled) {
      await RuleService.set([{...rule, id}]);
    }
    await StorageService.set({[id]: { ...ruleMetaData, id }});
  }
  
  async updateRule({rule, ruleMetaData}): Promise<void> {
    if(rule && ruleMetaData.enabled) {
      await RuleService.set([rule], [rule])
    }
    await StorageService.set({[ruleMetaData.id]: ruleMetaData});
  }

  async getStorageRules(): Promise<IRuleMetaData[]> {
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
    const ruleMetaData = await StorageService.getSingleItem(String(id));
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

  async importRules<T = Omit<IRuleMetaData, 'id' >>(ruleMetaData: T[]): Promise<void> {
    for(let i = 0; i < ruleMetaData.length; i++) {
      try {
        const rule: any = ruleMetaData[i];
        const data: IForm = {
          rule: config[rule.pageType].generateRule(rule),
          ruleMetaData: rule,
        }
        await this.addRule(data);  
      } catch (error) {}
      
    }
  }
}

new ServiceWorker();