import MatcherService from "@services/MatcherService";
import { NAMESPACE } from "@options/constant";
import { IRuleMetaData, PageType } from "@/models/formFieldModel";
import { PostMessageAction } from "@/models/postMessageActionModel";

let logShown = false;

// export const getFunctionFromCode = (code, ruleType) => {
//   try {
//     return generateUserFunctionWithSharedState(code);
//   } catch (e) {
//     notifyOnErrorOccurred({
//       initiator: location.origin,
//       url: location.href,
//     }).then(() => {
//       if (!logShown) {
//         logShown = true;
//         console.log(
//           `%cRequestly%c Please reload the page for ${ruleType} rule to take effect`,
//           "color: #3c89e8; padding: 1px 5px; border-radius: 4px; border: 1px solid #91caff;",
//           "color: red; font-style: italic"
//         );
//       }
//     });
//     return () => {};
//   }
// };

// const generateUserFunctionWithSharedState = function (functionStringEscaped) {
//   const SHARED_STATE_VAR_NAME = "$sharedState";

//   let sharedState;
//   try {
//     sharedState = window.top[PUBLIC_NAMESPACE]?.sharedState ?? {};
//   } catch (e) {
//     sharedState = window[PUBLIC_NAMESPACE]?.sharedState ?? {};
//   }

//   const { func: generatedFunction, updatedSharedState } = new Function(
//     `${SHARED_STATE_VAR_NAME}`,
//     `return { func: ${functionStringEscaped}, updatedSharedState: ${SHARED_STATE_VAR_NAME}}`
//   )(sharedState);

//   return generatedFunction;
// };

const isNonJsonObject = (obj) => {
  return [
    Blob,
    ArrayBuffer,
    Object.getPrototypeOf(Uint8Array), // TypedArray instance type
    DataView,
    FormData,
    URLSearchParams,
  ].some((nonJsonType) => obj instanceof nonJsonType);
};

export const getCustomRequestBody = (requestRule, args) => {
  const modification = requestRule.pairs[0].request;
  let requestBody;
  if (modification.type === "static") {
    requestBody = modification.value;
  } else {
    // requestBody = getFunctionFromCode(modification.value, "request")(args);
  }

  if (typeof requestBody !== "object" || isNonJsonObject(requestBody)) {
    return requestBody;
  }

  return JSON.stringify(requestBody);
};

const postMessageAndWaitForAck = async (message, action) => {
  window.postMessage(
    {
      ...message,
      action,
      source: "requestly:client",
    },
    window.location.href
  );

  let ackHandler;

  const ackAction = `${action}:processed`;

  return Promise.race([
    new Promise((resolve) => setTimeout(resolve, 2000)),
    new Promise((resolve) => {
      ackHandler = (event) => {
        if (event.data.action === ackAction) {
          // @ts-ignore
          resolve();
        }
      };
      window.addEventListener("message", ackHandler);
    }),
  ]).finally(() => {
    window.removeEventListener("message", ackHandler);
  });
};

export const notifyOnBeforeRequest = async (requestDetails) => {
  return postMessageAndWaitForAck({ requestDetails }, "onBeforeAjaxRequest");
};

export const notifyOnErrorOccurred = async (requestDetails) => {
  return postMessageAndWaitForAck({ requestDetails }, "onErrorOccurred");
};

export const isPromise = (obj) =>
  !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";

export const isJSON = (data) => {
  const parsedJson = jsonifyValidJSONString(data);
  return parsedJson !== data;
};

/**
 * @param mightBeJSONString string which might be JSON String or normal String
 * @param doStrictCheck should return empty JSON if invalid JSON string
 */
export const jsonifyValidJSONString = (mightBeJSONString, doStrictCheck = false) => {
  const defaultValue = doStrictCheck ? {} : mightBeJSONString;

  if (typeof mightBeJSONString !== "string") {
    return defaultValue;
  }

  try {
    return JSON.parse(mightBeJSONString);
  } catch (e) {
    /* Do Nothing. Unable to parse the param value */
  }

  return defaultValue;
};

export const notifyResponseRuleApplied = (message) => {
  window?.top?.postMessage(
    {
      source: "requestly:client",
      action: "response_rule_applied",
      rule: message.ruleDetails,
      requestDetails: message["requestDetails"],
    },
    window.location.href
  );
};

export const notifyRequestRuleApplied = (message) => {
  window?.top?.postMessage(
    {
      source: "requestly:client",
      action: "request_rule_applied",
      rule: message.ruleDetails,
      requestDetails: message["requestDetails"],
    },
    window.location.href
  );
};

export const getMatchedRuleByUrl = (url) => {
  const absoluteUrl = getAbsoluteUrl(url);
  const matchedRules = {};
  window[NAMESPACE].rules.forEach((rule) => {
    rule.conditions.forEach((condition) => {
      if (MatcherService.isUrlsMatch(condition.source, absoluteUrl, condition.matchType)) {
        matchedRules[rule.pageType] = rule;
      }
    });
  });
  // if (matchedRule) updateTimestamp(matchedRule);
  return matchedRules;
};

export const updateTimestamp = (ruleMetaData: IRuleMetaData): void => {
  try {
    chrome.runtime.sendMessage(window[NAMESPACE].runtimeId, {
      action: PostMessageAction.UpdateRuleTimestamp,
      data: { ruleMetaData, timestamp: Date.now() },
    });
  } catch (error) {}
};

// export const sendCacheSharedStateMessage = () => {
//   window.top.postMessage(
//     {
//       source: "requestly:client",
//       action: EXTENSION_MESSAGES.CACHE_SHARED_STATE,
//       sharedState: window[PUBLIC_NAMESPACE]?.sharedState,
//     },
//     window.location.href
//   );
// };

export const getAbsoluteUrl = (url) => {
  const dummyLink = document.createElement("a");
  dummyLink.href = url;
  return dummyLink.href;
};

// export const getMatchedRequestRule = (requestDetails) => {
//   return window[PUBLIC_NAMESPACE]?.requestRules?.findLast(
//     (rule) => matchRuleWithRequest(rule, requestDetails)?.isApplied === true
//   );
// };

// export const getMatchedResponseRule = (requestDetails) => {
//   return window[PUBLIC_NAMESPACE]?.responseRules?.findLast(
//     (rule) => matchRuleWithRequest(rule, requestDetails)?.isApplied === true
//   );
// };

export const isContentTypeJSON = (contentType) => !!contentType?.includes("application/json");

export const applyDelay = async (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
