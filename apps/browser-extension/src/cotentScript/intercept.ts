// @ts-nocheck
import MatcherService from "@services/MatcherService";
import { IRuleMetaData, PageType } from "@models/formFieldModel";
import { PostMessageAction } from "@models/postMessageActionModel";
import { NAMESPACE } from "@options/constant";
import { validateJSON } from "@/utils/validateJSON";
import { isPromise } from "@/utils/isPromise";

const jsonifyValidJSONString = (mightBeJSONString, doStrictCheck) => {
  const defaultValue = doStrictCheck ? {} : mightBeJSONString;

  if (typeof mightBeJSONString !== "string") {
    return defaultValue;
  }

  try {
    return JSON.parse(mightBeJSONString);
  } catch (e) {}

  return defaultValue;
};

const isContentTypeJSON = (contentType) => !!contentType?.includes("application/json");

((NAMESPACE) => {
  window[NAMESPACE] = window[NAMESPACE] || {};
  window[NAMESPACE].rules = window[NAMESPACE].rules || [];
  window[NAMESPACE].queueRequests = [];
  window[NAMESPACE].start = () => {
    if (window[NAMESPACE].rules.length) {
      startIntercept();
    }
  };
  const ExecuteCode = Function;

  function startIntercept() {
    const getAbsoluteUrl = (url: string): string => {
      const dummyLink = document.createElement("a");
      dummyLink.href = url;
      return dummyLink.href;
    };

    const getMatchedRuleByUrl = (url) => {
      const absoluteUrl = getAbsoluteUrl(url);
      const matchedRule = window[NAMESPACE].rules.find((rule) =>
        rule.conditions.some((condition) =>
          MatcherService.isUrlsMatch(condition.source, absoluteUrl, condition.matchType)
        )
      );
      if (matchedRule) updateTimestamp(matchedRule);
      return matchedRule;
    };

    const updateTimestamp = (ruleMetaData: IRuleMetaData): void => {
      try {
        chrome.runtime.sendMessage(window[NAMESPACE].runtimeId, {
          action: PostMessageAction.UpdateRuleTimestamp,
          data: { ruleMetaData, timestamp: Date.now() },
        });
      } catch (error) {}
    };

    // Fetch interceptor
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [resource, options = {}] = args;
      const getOriginalResponse = () => originalFetch(...args);

      let request;

      if (resource instanceof Request) {
        request = resource.clone();
      } else {
        request = new Request(resource.toString(), options);
      }

      const matchedRule = getMatchedRuleByUrl(request.url);

      if (
        matchedRule?.pageType !== PageType.MODIFY_RESPONSE &&
        (["GET", "HEAD"].includes(request.method.toUpperCase()) || !matchedRule)
      ) {
        try {
          return await getOriginalResponse();
        } catch (error) {
          return Promise.reject(error);
        }
      }

      if (matchedRule?.pageType === PageType.MODIFY_RESPONSE) {
        const response = await getOriginalResponse();
        const responseBody = response.headers.get("content-type")?.includes("application/json")
          ? await response.json()
          : await response.text();
        const args = {
          response: responseBody,
        };
        const returnedData = new ExecuteCode("args", `return (${matchedRule.editorValue})(args);`)(args);

        const customResponse = {
          status: response.status,
          statusText: response.statusText,
          body: JSON.stringify(returnedData),
          bodyAsJson: validateJSON(responseBody),
        };

        return new Response(customResponse.body, customResponse);
      }

      request = new Request(request.url, {
        method: request.method,
        body: matchedRule.editorValue,
        headers: request.headers,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        integrity: request.integrity,
        signal: request.signal,
      });

      try {
        return await originalFetch(request.clone());
      } catch (error) {
        return Promise.reject(error);
      }
    };

    const onReadyStateChange = async function () {
      const matchedRule = getMatchedRuleByUrl(this.requestURL);
      if (!matchedRule) return;
      if (this.readyState === this.HEADERS_RECEIVED || this.readyState === this.DONE) {
        const responseType = this.responseType;
        const contentType = this.getResponseHeader("content-type");

        if (this.readyState === this.HEADERS_RECEIVED) {
          try {
            Object.defineProperty(this, "status", {
              get: () => 200,
            });
          } catch (error) {}
        }

        if (this.readyState === this.DONE) {
          let customResponse =
            matchedRule?.pageType === PageType.MODIFY_RESPONSE
              ? new ExecuteCode("args", `return (${matchedRule.editorValue})(args);`)({ response: this.response })
              : this.response;

          // Convert customResponse back to rawText
          // response.value is String and evaluator method might return string/object
          if (isPromise(customResponse)) {
            customResponse = await customResponse;
          }

          const isUnsupportedResponseType = responseType && !["json", "text"].includes(responseType);

          if (isUnsupportedResponseType) {
            customResponse = this.response;
          }

          if (
            !isUnsupportedResponseType &&
            typeof customResponse === "object" &&
            !(customResponse instanceof Blob) &&
            (responseType === "json" || isContentTypeJSON(contentType))
          ) {
            customResponse = JSON.stringify(customResponse);
          }

          try {
            Object.defineProperty(this, "response", {
              get: function () {
                if (responseType === "json") {
                  if (typeof customResponse === "object") {
                    return customResponse;
                  }

                  return jsonifyValidJSONString(customResponse);
                }

                return customResponse;
              },
            });

            if (responseType === "" || responseType === "text") {
              Object.defineProperty(this, "responseText", {
                get: function () {
                  return customResponse;
                },
              });
            }
          } catch (error) {}
        }
      }
    };

    const XHR = XMLHttpRequest;
    XMLHttpRequest = function () {
      const xhr = new XHR();
      xhr.addEventListener("readystatechange", onReadyStateChange.bind(xhr), false);
      return xhr;
    };
    XMLHttpRequest.prototype = XHR.prototype;
    Object.entries(XHR).map(([key, val]) => {
      XMLHttpRequest[key] = val;
    });

    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      this.method = method;
      this.requestURL = getAbsoluteUrl(url);
      open.apply(this, arguments);
    };

    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (data) {
      const matchedRule = getMatchedRuleByUrl(this.requestURL);
      const requestBody = matchedRule?.pageType === PageType.MODIFY_REQUEST_BODY ? matchedRule.editorValue : data;
      send.call(this, requestBody);
    };

    let setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      this.requestHeaders = this.requestHeaders || {};
      this.requestHeaders[header] = value;
      setRequestHeader.apply(this, arguments);
    };
  }
})(NAMESPACE);
