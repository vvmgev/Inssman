import RuleService from '../services/RuleService';
import StorageService from '../services/StorageService';
import { PostMessageAction } from '../models/postMessageActionModel';
import handleError from './errorHandler';
import Rule = chrome.declarativeNetRequest.Rule;


import { storeError } from './firebase';

chrome.runtime.onInstalled.addListener(() => {});
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case PostMessageAction.AddRule:
      (async() => {
        try {
          const id: number = await StorageService.generateNextId();
          await RuleService.add([{id, ...request.data.rule}]);
          StorageService.set({[id]: request.data.ruleData});
          StorageService.setId(id);
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
          await RuleService.add([request.data.rule], [request.data.rule])
          StorageService.set({[request.data.rule.id]: request.data.ruleData});
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
    case PostMessageAction.GetRuleById:
      (async () => {
        try {
          const rule: Rule = await RuleService.getRuleById(request.id);
          const ruleData = await StorageService.get(String(rule.id))
          sendResponse({rule, ruleData: ruleData[rule.id]})  
        } catch (error) {
          sendResponse({error: true, info: handleError(error, {action: PostMessageAction[PostMessageAction.GetRuleById], data: request.data})})
        }
      })()
      return true;
      break;
    default:
      break;
  }
})
