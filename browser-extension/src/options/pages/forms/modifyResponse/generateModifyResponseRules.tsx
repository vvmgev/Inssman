import { MimeTypeMap } from "@/models/formFieldModel";
import { encode } from "@/utils/encode";

import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const generateRule = (fields) =>
  fields.conditions.map(() => ({
    action: {
      type: RuleActionType.REDIRECT,
      redirect: {
        url: encode(MimeTypeMap[fields.editorLang], fields.editorValue),
        // ...generateRegexSubstitution(ruleMetaData),
      },
    },
  }));

export default generateRule;
