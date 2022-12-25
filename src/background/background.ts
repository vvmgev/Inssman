import RuleService from '../services/RuleService';
import StorageService from '../services/StorageService';
import { StorageKey } from '../models/storageModel';
import { PostMessageAction } from '../models/postMessageActionModel';
const { RuleActionType } = chrome.declarativeNetRequest;
import Rule = chrome.declarativeNetRequest.Rule;


chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

chrome.runtime.onInstalled.addListener(() => {
});


chrome.declarativeNetRequest.getDynamicRules().then((data) => {
  const qq : number[] = data.map(as => as.id)
  // chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: qq})
})

// chrome.declarativeNetRequest.updateDynamicRules({
//   addRules: [
//     {
//       "id": 3,
//       "priority": 1,
//       "action": { "type": "block" as any },
//       "condition": {"urlFilter": "https://web-button.staging.getmati.com/button.js", "resourceTypes": ["script" as any]}
//     },
//   ],
//   removeRuleIds: [2,1, 3]
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case PostMessageAction.AddRule:
      (async() => {
        const id: number = await StorageService.setNextId();
        const rule: Rule = await RuleService.generateRule({id, ...request.data})
        StorageService.set({[rule.id]: request.data});
        sendResponse(await RuleService.add([rule]));
      })()
      return true;
      break;
    case PostMessageAction.UpdateRule:
      (async() => {
        console.log(request.data);
        const rule: Rule = await RuleService.generateRule(request.data)
        StorageService.set({[rule.id]: request.data});
        sendResponse(await RuleService.add([rule], [rule]))
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
          const degenerateRule = RuleService.degenerate(rule)
          return {...degenerateRule, ...(ruleData[rule.id])}
        }));
        sendResponse(rulesMap)
      })()
      return true;
      break;
    case PostMessageAction.GetRuleById:
      (async () => {
        const rule: Rule = await RuleService.getRuleById(request.id);
        const degenerateRule = RuleService.degenerate(rule)
        const ruleData = await StorageService.get(String(rule.id))
        sendResponse({...degenerateRule, ...(ruleData[rule.id])})
      })()
      return true;
      break;
    case PostMessageAction.Log:
      console.log(...request.data);
      break;
    default:
      break;
  }
})
