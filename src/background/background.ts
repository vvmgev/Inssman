import RuleService from '../services/RuleService';
import StorageService from '../services/StorageService';
import { PostMessageAction } from '../models/postMessageActionModel';
import Rule = chrome.declarativeNetRequest.Rule;

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
chrome.runtime.onInstalled.addListener(() => {});

const error1 = 'Only standard HTTP request headers that can specify multiple values for a single entry are supported';
const error2 = 'must not provide a header value for a header to be removed'

const handleError = (error: any) => {
  const message = error.message;
  if (message.includes(error1)) {
    return error1;
  }
  if (message.includes(error2)) {
    return error2;
  }
  return 'Unhandled error  = ' + message;
}

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
          sendResponse({error: true, message: handleError(error)})
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
          sendResponse({error: true, message: handleError(error)})
        }
      })()
      return true;
      break;
    case PostMessageAction.DeleteRule:
      (async () => {
        await RuleService.remove([request.data.rule])
        sendResponse();
      })()
      return true;
      break;
    case PostMessageAction.GetRules:
      (async () => {
        const rules: Rule[] = await RuleService.getRules();
        const rulesMap =  await Promise.all(rules.map(async (rule) => {
          const ruleData = await StorageService.get(String(rule.id))
          return {ruleData, rule};
        }));
        sendResponse(rulesMap)
      })()
      return true;
      break;
    case PostMessageAction.GetRuleById:
      (async () => {
        const rule: Rule = await RuleService.getRuleById(request.id);
        const ruleData = await StorageService.get(String(rule.id))
        sendResponse({rule, ruleData: ruleData[rule.id]})
      })()
      return true;
      break;
    default:
      break;
  }
})
