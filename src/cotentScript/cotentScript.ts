// @ts-nocheck
import { NAMESPACE } from 'src/models/contants';
import { MatchType } from 'src/models/formFieldModel';
 
((NAMESPACE) => {
  window[NAMESPACE] = window[NAMESPACE] || {};
  window[NAMESPACE].rules = window[NAMESPACE].rules || [];
  window[NAMESPACE].queueRequests = [];
  window[NAMESPACE].gotRules = false;
  window[NAMESPACE].start = () => {
    if(window[NAMESPACE].gotRules) return;
    window[NAMESPACE].gotRules = true;
  };
  
  const getAbsoluteUrl = (url: string): string => {
    const dummyLink = document.createElement("a");
    dummyLink.href = url;
    return dummyLink.href;
  };
  
  const getMatchedRuleByUrl = url => {
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

    if(["GET", "HEAD"].includes(request.method.toUpperCase()) || !matchedRule) {
      try{
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

})(NAMESPACE);