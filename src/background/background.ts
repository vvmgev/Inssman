import RuleService from '../services/RuleService';
import StorageService from '../services/StorageService';
import { PostMessageAction } from '../models/postMessageActionModel';
import handleError from './errorHandler';
import '../services/InjectFileService';
import Rule = chrome.declarativeNetRequest.Rule;

chrome.runtime.onInstalled.addListener(() => {
  const addId = async () => {
    Object.entries(await StorageService.get()).filter(async ([key, value]) => {
      if(typeof value === 'object' && typeof value.id === 'undefined') {
        await StorageService.set({[key]: {...value, id: Number(key)}});
      }
    });
  };
  addId();
});


chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case PostMessageAction.AddRule:
      (async() => {
        try {
          const id: number = await StorageService.generateNextId();
          if(request.data.rule) {
            await RuleService.add([{id, ...request.data.rule}]);
          }
          await StorageService.set({[id]: { ...request.data.ruleData, id }});
          await StorageService.setId(id);
          sendResponse();
        } catch (error: any) {
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[PostMessageAction.AddRule], data: request.data})})
        }
      })()
      return true;
      break;
    case PostMessageAction.UpdateRule:
      (async() => {
        try {
          if(request.data.rule) {
            await RuleService.add([request.data.rule], [request.data.rule])
          }
          await StorageService.set({[request.data.ruleData.id]: request.data.ruleData});
          sendResponse()
        } catch (error: any) {
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[PostMessageAction.UpdateRule], data: request.data})})
        }
      })()
      return true;
      break;
    case PostMessageAction.DeleteRule:
      (async () => {
        try {
          await RuleService.remove([request.data.rule])
          sendResponse();  
        } catch (error) {
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[PostMessageAction.DeleteRule], data: request.data})})
        }
      })()
      return true;
      break;
    case PostMessageAction.DeleteRuleById:
      (async () => {
        try {
          await RuleService.removeById(request.data.id);
          await StorageService.remove(String(request.data.id))
          sendResponse();  
        } catch (error) {
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[PostMessageAction.DeleteRuleById], data: request.data})})
        }
      })()
      return true;
      break;
    case PostMessageAction.GetRules:
      (async () => {
        try {
          const rules: Rule[] = await RuleService.getRules();
          const rulesMap =  await Promise.all(rules.map(async (rule) => {
            const ruleData = await StorageService.get(String(rule.id))
            return {ruleData, rule};
          }));
          sendResponse(rulesMap);  
        } catch (error) {
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[PostMessageAction.GetRules]})})
        }
      })()
      return true;
      break;
    case PostMessageAction.GetStorageRules:
      (async () => {
        try {
          sendResponse(Object.values(await StorageService.get()).filter(rule => typeof rule === 'object'));  
        } catch (error) {
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[PostMessageAction.GetRules]})})
        }
      })()
      return true;
      break;
    case PostMessageAction.GetRuleById:
      (async () => {
        try {
          const rule: Rule = await RuleService.getRuleById(request.data.id);
          const ruleData = await StorageService.get(String(request.data.id));
          sendResponse({rule, ruleData: ruleData[request.data.id]});
        } catch (error) {
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[PostMessageAction.GetRuleById], data: request.data})})
        }
      })()
      return true;
      break;
    case PostMessageAction.Reset:
      (async () => {
        try {
          await RuleService.reset();
          await StorageService.reset();
          sendResponse();
        } catch (error) {
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[PostMessageAction.Reset]})})
        }
      })()
      return true;
      break;
    default:
      break;
  }
})
