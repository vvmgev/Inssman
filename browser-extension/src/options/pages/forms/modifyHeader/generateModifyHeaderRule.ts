import { HeaderModificationType, MatchType, PageType, QueryParamAction } from "@/models/formFieldModel";

import RuleActionType = chrome.declarativeNetRequest.RuleActionType;
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;

const getRequestHeaders = (headers) => {
  return headers
    .filter((header) => header.type === HeaderModificationType.REQUEST)
    .map((header) => ({
      header: header.header,
      operation: header.operation,
      ...(header.operation !== HeaderOperation.REMOVE && {
        value: header.value,
      }),
    }));
};

const getResponseHeaders = (headers) => {
  return headers
    .filter((header) => header.type === HeaderModificationType.RESPONSE)
    .map((header) => ({
      header: header.header,
      operation: header.operation,
      ...(header.operation !== HeaderOperation.REMOVE && {
        value: header.value,
      }),
    }));
};

const generateRule = (fields) => {
  const requestHeaders = getRequestHeaders(fields.modifyHeaders);
  const responseHeaders = getResponseHeaders(fields.modifyHeaders);

  return fields.conditions.map(() => ({
    action: {
      type: RuleActionType.MODIFY_HEADERS,
      ...(requestHeaders.length && { requestHeaders }),
      ...(responseHeaders.length && { responseHeaders }),
    },
  }));
};

export default generateRule;
