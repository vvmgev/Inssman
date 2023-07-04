import RuleService from 'services/RuleService';
import StorageService from 'services/StorageService';
import BSService from 'services/BrowserSupportService';
import handleError from './errorHandler';
import { PostMessageAction } from 'models/postMessageActionModel';
import { IRuleData, PageType } from 'src/models/formFieldModel';
import { NAMESPACE } from 'src/models/contants';
import { StorageItemType, StorageKey } from 'src/models/storageModel';
import 'services/WebRequestService';
import 'services/InjectFileService';
import Rule = chrome.declarativeNetRequest.Rule;

class ServiceWorker {
  constructor() {
    this.registerListener();
  };

  registerListener(): void {
    chrome.runtime.onInstalled.addListener(this.onInstalled);
    chrome.runtime.onMessage.addListener(this.onMessage);
    chrome.tabs.onUpdated.addListener(this.onUpdatedTab);
  };

  onInstalled = async () => {
    const config = await StorageService.getSingleItem(StorageKey.CONFIG);
    if(!config) {
      StorageService.set({[StorageKey.CONFIG]: {}});
    }
  }

  onUpdatedTab = async(tabId, _, tab): Promise<void> => {
    if(BSService.isSupportScripting()){
      if (
        tab.url?.startsWith("chrome://") ||
        tab.url?.startsWith('chrome-extension') ||
        tab.url?.startsWith('https://chrome.google.com')) return;
      const rules: any = await this.getStorageRulesByProperty({property: 'pageType', value: PageType.MODIFY_REQUEST_BODY});
      chrome.scripting.executeScript({
        target : {tabId},
        func: (rules: IRuleData[], NAMESPACE: string) => {
          window[NAMESPACE].rules = rules.filter(rule => rule.enabled);
          window[NAMESPACE].start();
        },
        world: 'MAIN',
        args: [rules, NAMESPACE],
        // @ts-ignore
        injectImmediately: true,
      }).catch(() => {
        // should be tracking here
      });
    }
  }

  onMessage = (request, _, sendResponse): boolean => {
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
    return true;
  };

  async getRuleById(data): Promise<any> {
    const rule: Rule = await RuleService.getRuleById(data.id);
    const ruleData = await StorageService.get(String(data.id));
    return {rule, ruleData: ruleData[data.id]};
  }

  async addRule({rule, ruleData}: { rule?, ruleData: IRuleData }): Promise<void> {
    const id: number = await StorageService.generateNextId();
    if(rule && ruleData.enabled) {
      await RuleService.set([{...rule, id}]);
    }
    if(!ruleData.enabled && ruleData.rule) {
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

  async getStorageRulesByProperty({ property, value }): Promise<{ [key: string]: any}> {
    const rules: IRuleData[] = await StorageService.getRules();
    return rules.filter((rule) => rule[property] === value);
  }

  async deleteRules(): Promise<void> {
    await RuleService.remove(await RuleService.get());
    await StorageService.remove(await StorageService.getRules());
  }

  async deleteRuleById(data): Promise<void> {
    await RuleService.removeById(data.id);
    await StorageService.removeByKey(String(data.id))
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