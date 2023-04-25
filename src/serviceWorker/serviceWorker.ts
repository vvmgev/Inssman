import RuleService from '../services/RuleService';
import StorageService from '../services/StorageService';
import { PostMessageAction } from '../models/postMessageActionModel';
import handleError from './errorHandler';
import manifest from '../manifest.json';
import '../services/WebRequestService';
import '../services/InjectFileService';
import Rule = chrome.declarativeNetRequest.Rule;
import { storeVersion } from './firebase';


class ServiceWorker {
  constructor() {
    this.registerListener();
  };

  tempFuncs = () => {
    storeVersion(manifest.version);
    this.convertOldDataToNew();
  }

  // temproray function
  // should be removed
  async convertOldDataToNew() {
    await new Promise<void>(async (resolve) => {
      Object.entries(await StorageService.get()).filter(async ([key, value]) => {
        if(typeof value === 'object' && typeof value.id === 'undefined') {
          await StorageService.set({[key]: {...value, id: Number(key)}});
        }
        await Promise.resolve();
      });
      resolve();
    });
    if(manifest.version < '1.0.13') {
      const rules = await RuleService.getRules();
      const ruleData = await StorageService.get();
      await RuleService.erase();
      await StorageService.erase();

      for (const item of rules) {
        try {
          const newItem: any = item;
          const ruleId = newItem.id;
          const id: number = await RuleService.generateNextId();
          newItem.id = id;
          await RuleService.add([newItem as Rule]);
          const ruleDataItem = ruleData[ruleId];
          ruleDataItem.id = id;
          await StorageService.set({[id]: {...ruleDataItem, id}});
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  registerListener(): void {
    chrome.runtime.onInstalled.addListener(this.tempFuncs);
    chrome.runtime.onMessage.addListener(this.messageHandler);
  };

  messageHandler = (request, sender, sendResponse): boolean => {
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
        } else if(action === PostMessageAction.DeleteRule) {
          responseData = this.deleteRule(data);
        } else if(action === PostMessageAction.DeleteRuleById) {
          responseData = this.deleteRuleById(data);
        } else if(action === PostMessageAction.ERASE) {
          responseData = this.erase();
        } else if(action === PostMessageAction.GetUserId) {
          responseData = this.getUserId();
        }
        sendResponse(await responseData);
      } catch (error) {
        sendResponse({error: true, info: handleError(error, {action: PostMessageAction[action], data: request.data})})
      }
    })();
    return true;
  };

  async getRuleById(data): Promise<any> {
    const rule: Rule = await RuleService.getRuleById(data.id);
    const ruleData = await StorageService.get(String(data.id));
    return {rule, ruleData: ruleData[data.id]};
  }

  async addRule(data): Promise<void> {
    const id: number = await RuleService.generateNextId();
    if(data.rule) {
      await RuleService.add([{id, ...data.rule}]);
    }
    await StorageService.set({[id]: { ...data.ruleData, id }});
  }
  
  async updateRule(data): Promise<void> {
    if(data.rule) {
      await RuleService.add([data.rule], [data.rule])
    }
    await StorageService.set({[data.ruleData.id]: data.ruleData});
  }

  async getStorageRules(): Promise<{ [key: string]: any}> {
    return Object.values(await StorageService.get()).filter(rule => typeof rule === 'object');
  }

  async deleteRule(data): Promise<void> {
    await RuleService.remove([data.rule])
  }

  async deleteRuleById(data): Promise<void> {
    await RuleService.removeById(data.id);
    await StorageService.remove(String(data.id))
  }

  async erase(): Promise<void> {
    await RuleService.erase();
    await StorageService.erase();
  }

  async getUserId(): Promise<any> {
    return await StorageService.getUserId();
  }

}

new ServiceWorker();