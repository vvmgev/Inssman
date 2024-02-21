import generateRedirectRule from "@/options/pages/forms/redirect/generateRedirectRules";
import generateBlockRule from "@/options/pages/forms/block/generateBlockRule";
import generateQueryParamRule from "@/options/pages/forms/queryParam/generateQueryParamRule";
import generateModifyHeaderRule from "@/options/pages/forms/modifyHeader/generateModifyHeaderRule";
import generateModifyResponseRule from "@/options/pages/forms/modifyResponse/generateModifyResponseRules";
import generateInjectFileRule from "@/options/pages/forms/injectFile/generateInjectFileRules";
import generateModifyRequestBodyRule from "@/options/pages/forms/modifyRequestBody/generateModifyRequestBodyRules";
import { MatchType, MatchTypeMap, PageType } from "@/models/formFieldModel";
import { makeExactMatch, replaceAsterisk, replaceAsteriskToPlus } from "@/utils/regExp";
import { structuredClone } from "@/utils/structuredClone";

import ResourceType = chrome.declarativeNetRequest.ResourceType;

const generateRuleMap = {
  [PageType.REDIRECT]: generateRedirectRule,
  [PageType.BLOCK]: generateBlockRule,
  [PageType.QUERY_PARAM]: generateQueryParamRule,
  [PageType.MODIFY_HEADER]: generateModifyHeaderRule,
  [PageType.MODIFY_RESPONSE]: generateModifyResponseRule,
  [PageType.INJECT_FILE]: generateInjectFileRule,
  [PageType.MODIFY_REQUEST_BODY]: generateModifyRequestBodyRule,
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
  const cloneFields = structuredClone(fields);
  cloneFields.conditions = cloneFields.conditions.filter(({ enabled }) => enabled);
  cloneFields.queryParams = cloneFields?.queryParams?.filter(({ enabled }) => enabled);
  cloneFields.headers = cloneFields?.headers?.filter(({ enabled }) => enabled);
  const generatedRule = generateRuleMap[cloneFields.pageType](cloneFields) || [];
  return generatedRule.map((rule, index) => ({
    ...rule,
    id: (cloneFields.connectedRuleIds || [])[index],
    condition: {
      ...generateMatchType(
        cloneFields.conditions[index].matchType,
        cloneFields.conditions[index].source,
        PageType.REDIRECT
      ),
      resourceTypes: Object.values(ResourceType),
      isUrlFilterCaseSensitive: false,
    },
  }));
};

export default generateRules;
