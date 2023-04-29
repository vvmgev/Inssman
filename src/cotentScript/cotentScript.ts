 // @ts-nocheck
import fetchIntercept from 'fetch-intercept';
import { NAMESPACE } from 'src/models/contants';
import { MatchType } from 'src/models/formFieldModel';

((NAMESPACE) => {
  window[NAMESPACE] = window[NAMESPACE] || {};
  window[NAMESPACE].rules = window[NAMESPACE].rules || [];
  window[NAMESPACE].queueRequests = [];
  window[NAMESPACE].gotRules = false;
  window[NAMESPACE].start = () => {
    window[NAMESPACE].gotRules = true;
    window[NAMESPACE].queueRequests.forEach(request => request())
    window[NAMESPACE].queueRequests = [];
  };
  
  const getAbsoluteUrl = (url: string): string => {
    const dummyLink = document.createElement("a");
    dummyLink.href = url;
    return dummyLink.href;
  };
  
  const getMatchedByUrl = url => {
    const absoluteUrl = getAbsoluteUrl(url);
    return window[NAMESPACE].rules.find(rule => {
      if(rule.matchType === MatchType.CONTAIN) {
        return absoluteUrl.includes(rule.source);
      }
      if(rule.matchType === MatchType.EQUAL) {
        return absoluteUrl === rule.source;
      }
    });
  }
  
  const XHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
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
    const makeRequest = () => {
      let requestBody = data;
      const matchedRule = getMatchedByUrl(this.requestURL)
      if(matchedRule) {
        requestBody = matchedRule.editorValue;
      }
      this.requestData = requestBody;
      send.call(this, requestBody);
    };

    if(!window[NAMESPACE].gotRules) {
      window[NAMESPACE].queueRequests.push(makeRequest);
      return;
    }
    makeRequest();
  };
  
  const setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    this.requestHeaders = this.requestHeaders || {};
    this.requestHeaders[header] = value;
    setRequestHeader.apply(this, arguments);
  };

  fetchIntercept.register({
    request: function (url, config) {
      const makeRequest = (outSideResolve) => {
        return new Promise((resolve) => {
          if(!['GET', 'HEAD'].includes(config?.method?.toUpperCase())){
            const matchedRule = getMatchedByUrl(url);
            if(matchedRule) {
              config.body = matchedRule.editorValue;
            }
          }
          if(typeof outSideResolve === 'function') {
            outSideResolve([url, config]);
          }
          resolve([url, config]);
        });
      };

      if(!window[NAMESPACE].gotRules) {
        let outSideResolve;
        const promise = new Promise(async (resolve) => {
          outSideResolve = resolve;
        });

        window[NAMESPACE].queueRequests.push(() => makeRequest(outSideResolve));
        return promise;
      }

      return makeRequest();
    },
  });

})(NAMESPACE);