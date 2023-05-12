// @ts-nocheck
import originalFetch from './originalFetch';
import { NAMESPACE } from 'src/models/contants';
import { MatchType } from 'src/models/formFieldModel';
import { BatchInterceptor } from '@mswjs/interceptors';
import browserInterceptors from '@mswjs/interceptors/presets/browser';
 
 ((NAMESPACE) => {
   window[NAMESPACE] = window[NAMESPACE] || {};
   window[NAMESPACE].rules = window[NAMESPACE].rules || [];
   window[NAMESPACE].queueRequests = [];
   window[NAMESPACE].gotRules = false;
   window[NAMESPACE].start = () => {
    if(window[NAMESPACE].gotRules) return;
    window[NAMESPACE].gotRules = true;
     if(!window[NAMESPACE].rules.length) {
       unregisterInterceptor();
     }
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

  const interceptor = new BatchInterceptor({
    name: 'interceptor',
    interceptors: browserInterceptors,
  })
  interceptor.apply();

  interceptor.on('request', async (request) => {
    const matchedRule = getMatchedByUrl(request.url);
    if(!matchedRule) {
        return;
    }
    const controller = new AbortController();
    const requestOptions = {signal: controller.signal};
    requestOptions.body = matchedRule.editorValue;
    [
        'cache',
        'context',
        'credentials',
        'destination',
        'headers',
        'integrity',
        'method',
        'mode',
        'redirect',
        'referrer',
        'referrerPolicy',
        'url',
        'bodyUsed',
        ].forEach((prop) => {
        if (prop in request) {
            requestOptions[prop] = request[prop];
        }
        });
    
    const {
        url,
        ...options
    } = requestOptions;
    const newRequest = new Request(url, options);
    const response = await originalFetch(newRequest);
    request.respondWith(response); 
  })

  const unregisterInterceptor = () => {
    interceptor.dispose();
  };

 })(NAMESPACE);