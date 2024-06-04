import { MimeTypeMap } from "@/models/formFieldModel";
import { encode } from "@/utils/encode";

import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

export enum ResponseMode {
  STATIC = "static",
  DYNAMIC = "dynamic",
}

const generateRule = (fields) => {
  if (fields.responseMode === ResponseMode.DYNAMIC) {
    return null;
  }
  return fields.conditions.map(() => ({
    action: {
      type: RuleActionType.REDIRECT,
      redirect: {
        url: encode(MimeTypeMap[fields.editorLang], fields.editorValue),
        // ...generateRegexSubstitution(ruleMetaData),
      },
    },
  }));
};

export default generateRule;
