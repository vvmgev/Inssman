import { MatchType, PageType, QueryParamAction } from "@/models/formFieldModel";
import { replaceVariable } from "@/utils/regExp";

import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const getQueryParams = (queryParams) => {
  return queryParams
    .filter((queryParam) => queryParam.key.length && queryParam.action !== QueryParamAction.REMOVE)
    .map((queryParam) => ({
      key: queryParam.key,
      value: queryParam.value,
      replaceOnly: queryParam.action === QueryParamAction.REPLACE,
    }));
};

const getRemoveQueryParams = (queryParams) => {
  return queryParams
    .filter((queryParam) => queryParam.key.length && queryParam.action === QueryParamAction.REMOVE)
    .map((queryParam) => queryParam.key);
};

const generateRegexSubstitution = ({ matchType, pageType, destination }): Record<string, string> => {
  const redirect: Record<string, string> = {};
  if (matchType === MatchType.WILDCARD && pageType === PageType.REDIRECT) {
    redirect.regexSubstitution = replaceVariable(destination as string);
  }
  return redirect;
};

const generateRule = (fields) =>
  fields.queryParams.map((queryParam) => ({
    action: {
      type: RuleActionType.REDIRECT,
      redirect: {
        transform: {
          queryTransform: {
            addOrReplaceParams: getQueryParams(queryParam.queryParams),
            removeParams: getRemoveQueryParams(queryParam.queryParams),
          },
        },
        ...generateRegexSubstitution(queryParam),
      },
    },
  }));

export default generateRule;
