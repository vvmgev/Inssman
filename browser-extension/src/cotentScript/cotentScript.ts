// @ts-nocheck
import MatcherService from "services/MatcherService";
import { IRuleMetaData } from "models/formFieldModel";
import { PostMessageAction } from "models/postMessageActionModel";
import { NAMESPACE } from "options/constant";

((NAMESPACE) => {
  window[NAMESPACE] = window[NAMESPACE] || {};
  window[NAMESPACE].rules = window[NAMESPACE].rules || [];
  window[NAMESPACE].queueRequests = [];
  window[NAMESPACE].gotRules = false;
  window[NAMESPACE].start = () => {
    if (window[NAMESPACE].gotRules) return;
    window[NAMESPACE].gotRules = true;
    startIntercept();
  };

  const startIntercept = () => {
    const getAbsoluteUrl = (url: string): string => {
      const dummyLink = document.createElement("a");
      dummyLink.href = url;
      return dummyLink.href;
    };

    const getMatchedRuleByUrl = (url) => {
      const absoluteUrl = getAbsoluteUrl(url);
      const matchedRule = window[NAMESPACE].rules.find((rule) =>
        MatcherService.isUrlsMatch(rule.source, absoluteUrl, rule.matchType)
      );
      if (matchedRule) updateTimestamp(matchedRule);
      return matchedRule;
    };

    const updateTimestamp = (ruleMetaData: IRuleMetaData): void => {
      try {
        chrome.runtime.sendMessage(window[NAMESPACE].runtimeId, {
          action: PostMessageAction.UpdateTimestamp,
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

      if (["GET", "HEAD"].includes(request.method.toUpperCase()) || !matchedRule) {
        try {
          return await getOriginalResponse();
        } catch (error) {
          return Promise.reject(error);
        }
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
      return xhr;
    };
    XMLHttpRequest.prototype = XHR.prototype;
    Object.entries(XHR).map(([key, val]) => {
      XMLHttpRequest[key] = val;
    });

    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      this.method = method;
      this.requestURL = url;
      open.apply(this, arguments);
    };

    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (data) {
      const matchedRule = getMatchedRuleByUrl(this.requestURL);
      const requestBody = matchedRule ? matchedRule.editorValue : data;
      this.requestData = requestBody;
      send.call(this, requestBody);
    };

    const setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      this.requestHeaders = this.requestHeaders || {};
      this.requestHeaders[header] = value;
      setRequestHeader.apply(this, arguments);
    };
  };
})(NAMESPACE);
