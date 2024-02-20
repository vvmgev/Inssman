import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const generateRule = (fields) =>
  fields.conditions.map(() => ({
    action: {
      type: RuleActionType.BLOCK,
    },
  }));

export default generateRule;
