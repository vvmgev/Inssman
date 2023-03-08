import RuleService from '../services/RuleService';
import StorageService from '../services/StorageService';
import { PostMessageAction } from '../models/postMessageActionModel';
import handleError from './errorHandler';
import '../services/InjectFileService';
import Rule = chrome.declarativeNetRequest.Rule;


class Background {
  constructor() {
    this.convertOldDataToNew();
    this.registerListener();
  };

  // temproray function
  // should be removed
  async convertOldDataToNew() {
    Object.entries(await StorageService.get()).filter(async ([key, value]) => {
      if(typeof value === 'object' && typeof value.id === 'undefined') {
        await StorageService.set({[key]: {...value, id: Number(key)}});
      }
    });
  };

  registerListener(): void {
    chrome.runtime.onInstalled.addListener(this.convertOldDataToNew);
    chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
    chrome.runtime.onMessage.addListener(this.messageHandler);
  };

  messageHandler = (request, sender, sendResponse): boolean => {
    const { action, data } = request;
    (async () => {
      let responseData: any;
      try {
        if(action === PostMessageAction.GetRules) {
          responseData = this.getRules();
        } else if(action === PostMessageAction.GetStorageRules) {
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
        } else if(action === PostMessageAction.Reset) {
          responseData = this.reset();
        }
        sendResponse(await responseData);
      } catch (error) {
        sendResponse({error: true, info: handleError(error, {action: PostMessageAction[action], data: request.data})})
      }
    })();
    return true;
  };

  async getRules(): Promise<any> {
    const rules: Rule[] = await RuleService.getRules();
    return await Promise.all(rules.map(async (rule) => {
      const ruleData = await StorageService.get(String(rule.id))
      return {ruleData, rule};
    }));
  }

  async getRuleById(data): Promise<any> {
    const rule: Rule = await RuleService.getRuleById(data.id);
    const ruleData = await StorageService.get(String(data.id));
    return {rule, ruleData: ruleData[data.id]};
  }

  async addRule(data): Promise<void> {
    const id: number = await StorageService.generateNextId();
    if(data.rule) {
      await RuleService.add([{id, ...data.rule}]);
    }
    await StorageService.set({[id]: { ...data.ruleData, id }});
    await StorageService.setId(id);
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

  async reset(): Promise<void> {
    await RuleService.reset();
    await StorageService.reset();
  }
}

new Background();