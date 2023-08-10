import RuleService from 'services/RuleService';
import StorageService from 'services/StorageService';
import BSService from 'services/BrowserSupportService';
import InjectCodeService from 'services/InjectCodeService';
import BaseService from 'services/BaseService';
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
    .addListener(ListenerType.ON_UPDATE_TAB, this.onUpdatedTab);
  };

  onInstalled = async () => {
    const config = await StorageService.getSingleItem(StorageKey.CONFIG);
    if(!config) {
      StorageService.set({[StorageKey.CONFIG]: {}});
    }
    // Temp function
    // Add 'resourceTypes' to local storage rules
    const ruleData = await StorageService.getRules();
    ruleData.forEach((item: IRuleData) => {
      if(!item.resourceTypes) {
        item.resourceTypes = [];
        StorageService.set({[item.id as number]: item});
      }
    })
  }


  onUpdatedTab = (tabId, changeInfo, tab): void => {
    this.injectContentScript(tabId, changeInfo, tab);
    // this.getMatchedRules(tab);
  }

  // getMatchedRules = async (tab) => {
    // if(tab.status === 'complete') {
      // const matchedRules = await RuleService.getMatchedRules();
      // console.log('matchedRules', matchedRules);
    // }
  // }

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
        } else if(action === PostMessageAction.GetRuleById) {
          responseData = this.getRuleById(data);
        } else if(action === PostMessageAction.AddRule) {
          responseData = this.addRule(data);
        } else if(action === PostMessageAction.UpdateRule) {
          responseData = this.updateRule(data);
        } else if(action === PostMessageAction.DeleteRules) {
          responseData = this.deleteRules();
        } else if(action === PostMessageAction.DeleteRuleById) {
          responseData = this.deleteRuleById(data);
        } else if(action === PostMessageAction.GetUserId) {
          responseData = this.getUserId();
        } else if(action === PostMessageAction.ChangeRuleStatusById) {
          responseData = this.changeRuleStatusById(data);
        } else if(action === PostMessageAction.CopyRuleById) {
          responseData = this.copyRuleById(data);
        }
        sendResponse(await responseData);
      } catch (error: any) {
        // Temp solution
        // Add 100 to ID
        const { version } = chrome.runtime.getManifest();
        const uniqueErrorText = 'does not have a unique ID.';
        const emptyRuleText = 'Error at parameter \'options\': Error at property \'addRules\': Error at index 0: Invalid type: expected declarativeNetRequest.Rule, found undefined.';
        if(error.message.includes(uniqueErrorText)) {
          const id: number = await StorageService.generateNextId();
          await StorageService.set({[StorageKey.NEXT_ID]: id + 100});
          sendResponse(await this.addRule(data));
          handleError(error, {action: PostMessageAction[action], data: {...data, version}});
        } else if(error.message.includes(emptyRuleText)) {
          // Temp solution
          // Track all data
          const ruleData = await StorageService.getSingleItem(String(data.id));
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[action], data: {...data, version, ruleData}})})
        } else {
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[action], data: {...data, version}})})
        }
      }
    })();
  };

  async getRuleById(data): Promise<any> {
    const ruleData = await StorageService.get(String(data.id));
    return {ruleData: ruleData[data.id]};
  }

  async addRule({rule, ruleData}: { rule?, ruleData: IRuleData }): Promise<void> {
    const id: number = await StorageService.generateNextId();
    if(rule && ruleData.enabled) {
      await RuleService.set([{...rule, id}]);
    }
    if(!ruleData.enabled && ruleData.rule) {
      // @ts-ignore
      ruleData.rule.id = id;
    }
    await StorageService.set({[id]: { ...ruleData, id }});
    await StorageService.set({[StorageKey.NEXT_ID]: id});
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

  async deleteRuleById(data): Promise<void> {
    await RuleService.removeById(data.id);
    await StorageService.remove(String(data.id));
  }

  async getUserId(): Promise<{[key: string]: number}> {
    return {[StorageKey.USER_ID]: await StorageService.getUserId()};
  }

  async changeRuleStatusById({ id, checked }): Promise<void> {
    const ruleData = await StorageService.getSingleItem(String(id));
    ruleData.enabled = checked;
    if(checked) {
      if(ruleData.pageType !== PageType.MODIFY_REQUEST_BODY) {
        await RuleService.set([ruleData.rule]);
      }
      await StorageService.set({[id]: ruleData})
      return;
    }
    const rule = await RuleService.getRuleById(id);
    ruleData.rule = rule;
    await RuleService.removeById(id);
    await StorageService.set({[id]: ruleData})  
  }

  async copyRuleById({ id }: {id: number}): Promise<void> {
    const copyOriginalRule = await StorageService.getSingleItem(String(id));
    copyOriginalRule.name += ' copy';
    await this.addRule({ruleData: copyOriginalRule});
  }
}

new ServiceWorker();