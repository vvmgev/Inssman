import { FilterType, MatchType, MatchTypeMap, PageType } from "@/models/formFieldModel";
import { addProtocol, replaceVariable } from "@/utils/regExp";

import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const generateRule = (fields) =>
  fields.conditions.map((condition) => ({
    action: {
      type: RuleActionType.REDIRECT,
      redirect: {
        ...(MatchTypeMap[condition.matchType] === FilterType.REGEXFILTER
          ? {
              regexSubstitution:
                condition.matchType === MatchType.EQUAL
                  ? addProtocol(fields.destination)
                  : replaceVariable(addProtocol(fields.destination)),
            }
          : { url: addProtocol(fields.destination) }),
      },
    },
  }));

export default generateRule;
