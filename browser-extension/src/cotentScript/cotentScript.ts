// @ts-nocheck
import MatcherService from "@services/MatcherService";
import { IRuleMetaData, PageType } from "@models/formFieldModel";
import { PostMessageAction } from "@models/postMessageActionModel";
import { NAMESPACE } from "@options/constant";
import { validateJSON } from "@/utils/validateJSON";
import { jsonParesString } from "@/utils/jsonParesString";

((NAMESPACE) => {
  window[NAMESPACE] = window[NAMESPACE] || {};
  window[NAMESPACE].rules = window[NAMESPACE].rules || [];
  window[NAMESPACE].queueRequests = [];
  window[NAMESPACE].isExecuted = window[NAMESPACE].isExecuted || false;
  window[NAMESPACE].start = () => {
    startIntercept();
  };
  if (!window[NAMESPACE].isExecuted) {
    window[NAMESPACE].isExecuted = true;
    window[NAMESPACE].start();
  }
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
          MatcherService.isUrlsMatch(condition.source, absoluteUrl, condition.matchType),
        ),
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

      if (["HEAD"].includes(request.method.toUpperCase()) || !matchedRule) {
        try {
          return await getOriginalResponse();
        } catch (error) {
          return Promise.reject(error);
        }
      }

      if (matchedRule.pageType === PageType.MODIFY_RESPONSE) {
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

    // XMLHttpRequest interceptor
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

    const onReadystatechange = async function () {
      if (this.readyState === this.DONE) {
        const responseData = this.response;
        const matchedRule = getMatchedRuleByUrl(this.requestURL);

        const args = {
          response: jsonParesString(responseData),
        };

        // Execute custom function
        let returnedData = matchedRule
          ? await new ExecuteCode("args", `return (${matchedRule.editorValue})(args);`)(args)
          : responseData;

        const requestHeaders = this.requestHeaders || {};
        const isJson =
          requestHeaders["Content-Type"]?.includes("json") ||
          requestHeaders["Accept"]?.includes("json") ||
          this.responseType === "json";

        // Convert response back to string, Blob isn't necessary
        if (isJson && !(returnedData instanceof Blob)) {
          try {
            returnedData = JSON.stringify(returnedData);
          } catch (error) {}
        }

        // Modify response
        Object.defineProperty(this, "response", {
          get: function () {
            return returnedData;
          },
        });

        // Modify responseText
        if (this.responseType === "" || this.responseType === "text") {
          Object.defineProperty(this, "responseText", {
            get: function () {
              return returnedData;
            },
          });
        }
      }
    };

    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      this.method = method;
      this.requestURL = url;
      open.apply(this, arguments);
    };

    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (data) {
      const matchedRule = getMatchedRuleByUrl(this.requestURL);
      // Modify request body
      const requestBody = matchedRule?.pageType === PageType.MODIFY_REQUEST_BODY ? matchedRule.editorValue : data;
      this.requestData = requestBody;
      send.call(this, requestBody);
    };

    const setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      this.requestHeaders = this.requestHeaders || {};
      this.requestHeaders[header] = value;
      setRequestHeader.apply(this, arguments);
    };
  }
})(NAMESPACE);
