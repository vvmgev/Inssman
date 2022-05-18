import RuleService from '../services/RuleService';
import { PostMessageAction } from '../models/postMessageAction';
const { RuleActionType } = chrome.declarativeNetRequest;

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

chrome.runtime.onInstalled.addListener(() => {});


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
      RuleService.add([RuleService.generateRule(request.data)])
      .then(sendResponse)
      .catch(error => {
        console.log('error', error);
        sendResponse({error})
    });
      return true;
      break;
    case PostMessageAction.UpdateRule:
      break;
    case PostMessageAction.DeleteRule:
      break;
    case PostMessageAction.GetRules:
      RuleService.getRules().then(sendResponse);
      return true;
      break;
    case PostMessageAction.Log:
      console.log(...request.data);
      break;
    default:
      break;
  }
})
