import { MimeTypeMap } from "@/models/formFieldModel";
import { encode } from "@/utils/encode";

import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

export enum ModificationType {
  STATIC = "static",
  DYNAMIC = "dynamic",
}

const generateRule = (fields) => {
  if (fields.modificationType === ModificationType.DYNAMIC) {
    return null;
  }
  return fields.conditions.map(() => ({
    action: {
      type: "redirect",
      redirect: {
        url: encode(MimeTypeMap[fields.editorLang], fields.editorValue),
        // ...generateRegexSubstitution(ruleMetaData),
      },
    },
  }));
};

export default generateRule;
