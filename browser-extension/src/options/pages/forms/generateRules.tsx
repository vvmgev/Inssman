import generateRedirectRule from "./redirect/generateRedirectRules";
import generateBlockRule from "./block/generateBlockRule";
import generateQueryParamRule from "./queryParam/generateQueryParamRule";
import generateModifyHeaderRule from "./modifyHeader/generateModifyHeaderRule";
import generateModifyResponseRule from "./modifyResponse/generateModifyResponseRules";
import { MatchType, MatchTypeMap, PageType } from "@/models/formFieldModel";
import { makeExactMatch, replaceAsterisk, replaceAsteriskToPlus } from "@/utils/regExp";

import ResourceType = chrome.declarativeNetRequest.ResourceType;

const generateRuleMap = {
  [PageType.REDIRECT]: generateRedirectRule,
  [PageType.BLOCK]: generateBlockRule,
  [PageType.QUERY_PARAM]: generateQueryParamRule,
  [PageType.MODIFY_HEADER]: generateModifyHeaderRule,
  [PageType.MODIFY_RESPONSE]: generateModifyResponseRule,
};

const generateMatchType = (matchType, source, pageType): Record<string, string> => {
  let newSource: string = source;

  if (matchType === MatchType.EQUAL) {
    newSource = makeExactMatch(source);
  }

  if (matchType === MatchType.WILDCARD) {
    newSource = PageType.MODIFY_REQUEST_BODY === pageType ? replaceAsteriskToPlus(source) : replaceAsterisk(source);
  }

  return {
    [MatchTypeMap[matchType]]: newSource,
  };
};

const generateRules = (fields) => {
  return generateRuleMap[fields.pageType](fields).map((rule, index) => ({
    ...rule,
    id: (fields.connectedRuleIds || [])[index],
    condition: {
      ...generateMatchType(fields.conditions[index].matchType, fields.conditions[index].source, PageType.REDIRECT),
      resourceTypes: Object.values(ResourceType),
    },
  }));
};

export default generateRules;
