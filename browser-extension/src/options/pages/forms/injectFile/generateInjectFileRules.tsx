import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const generateRule = (fields) =>
  fields.conditions.map(() => ({
    action: {
      type: RuleActionType.MODIFY_HEADERS,
      responseHeaders: [
        {
          header: "Content-Security-Policy",
          operation: HeaderOperation.REMOVE,
        },
      ],
    },
  }));

export default generateRule;
