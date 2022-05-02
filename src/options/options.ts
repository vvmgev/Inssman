import { FormField, MatchType } from "../models/formField";
import { PostMessageAction } from "../models/postMessageAction";
import ResourceType = chrome.declarativeNetRequest.ResourceType
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import RequestMethod = chrome.declarativeNetRequest.RequestMethod
import Rule = chrome.declarativeNetRequest.Rule

// const data: FormField = {
//   matchType: MatchType.CONTAIN,
//   condition : {
//     resourceTypes: [ResourceType.SCRIPT],
//     requestMethods: [],
//     // urlFilter: 'https://web-button.staging.getmati.com/button.js',
//     urlFilter: '*://web-button.staging.*.com/abutton.js',
//   },
//   action: {
//     type: RuleActionType.BLOCK,
//   },
// }

const data: FormField =   {
  matchType: MatchType.CONTAIN,
  "action": {
    "type": "redirect" as RuleActionType,
    "redirect": {
      "regexSubstitution": "https://\\1.xyz.com/"
    }
  },
  "condition": {
    "regexFilter": "^https://www\\.(abc|def)\\.xyz\\.com/",
    "resourceTypes": [
      "main_frame" as ResourceType
    ]
  }
};

chrome.runtime.sendMessage({action: PostMessageAction.AddRule, data});

// chrome.runtime.sendMessage({action: PostMessageAction.GetRules}, (rules: Rule[]) => {
// })
