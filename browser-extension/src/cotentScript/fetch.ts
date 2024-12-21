import { PageType } from "@/models/formFieldModel";
import { ModificationType } from "@/options/pages/forms/modifyResponse/generateModifyResponseRules";
import {
  // applyDelay,
  getAbsoluteUrl,
  getCustomRequestBody,
  // getFunctionFromCode,
  // getMatchedRequestRule,
  // getMatchedResponseRule,
  isContentTypeJSON,
  isPromise,
  jsonifyValidJSONString,
  // notifyOnBeforeRequest,
  // notifyRequestRuleApplied,
  // notifyResponseRuleApplied,
  getMatchedRuleByUrl,
} from "@utils/contentScript";

export const initFetchInterceptor = () => {
  const _fetch = fetch;
  // @ts-ignore
  fetch = async (...args) => {
    const [resource, initOptions = {}] = args;
    // @ts-ignore
    const getOriginalResponse = () => _fetch(...args);
    try {
      let request;

      if (resource instanceof Request) {
        request = resource.clone();
      } else {
        request = new Request(resource.toString(), initOptions);
      }

      const url = getAbsoluteUrl(request.url);
      const method = request.method;

      const canRequestBodyBeSent = !["GET", "HEAD"].includes(method);
      const { [PageType.MODIFY_REQUEST_BODY]: requestRule, [PageType.MODIFY_RESPONSE]: responseRule }: any =
        getMatchedRuleByUrl(url) as any;

      console.log("requestRule", requestRule);
      console.log("responseRule", responseRule);

      // getMatchedRequestRule({
      //   url: url,
      //   method: method,
      //   type: "fetch",
      //   initiator: location.origin,
      // });

      if (requestRule && canRequestBodyBeSent) {
        const originalRequestBody = await request.text();
        let requestBody = requestRule.editorValue;

        if (requestRule.modificationType === ModificationType.DYNAMIC) {
          requestBody = new Function("args", `return (${requestRule.editorValue})(args);`)({
            body: originalRequestBody,
            method: initOptions.method,
            url: request.url,
          });
        }

        request = new Request(request.url, {
          method,
          body: requestBody,
          headers: request.headers,
          referrer: request.referrer,
          referrerPolicy: request.referrerPolicy,
          mode: request.mode,
          credentials: request.credentials,
          cache: request.cache,
          redirect: request.redirect,
          integrity: request.integrity,
        });

        // notifyRequestRuleApplied();
      }

      let requestData;
      if (canRequestBodyBeSent) {
        requestData = jsonifyValidJSONString(await request.clone().text());
      }

      let responseHeaders;
      let fetchedResponse;

      if (responseRule) {
        try {
          const headersObject = {};
          request?.headers?.forEach((value, key) => {
            headersObject[key] = value;
          });
          // await notifyOnBeforeRequest({
          //   url,
          //   method,
          //   type: "xmlhttprequest",
          //   initiator: location.origin,
          //   requestHeaders: headersObject,
          // });

          if (requestRule) {
            // use modified request to fetch response
            fetchedResponse = await _fetch(request);
          } else {
            fetchedResponse = await getOriginalResponse();
          }

          if (!responseRule) {
            return fetchedResponse;
          }

          responseHeaders = fetchedResponse?.headers;
        } catch (error) {
          if (!responseRule) {
            return Promise.reject(error);
          }
        }
      }

      let customResponse;
      if (responseRule.modificationType === ModificationType.DYNAMIC) {
        const requestHeaders =
          request.headers &&
          // @ts-ignore
          Array.from(request.headers).reduce((obj, [key, val]) => {
            // @ts-ignore
            obj[key] = val;
            return obj;
          }, {});

        let responseArgs: any = {
          method,
          url,
          requestHeaders,
          requestData,
        };

        if (fetchedResponse) {
          const fetchedResponseData = await fetchedResponse.text();
          const responseType = fetchedResponse.headers.get("content-type");
          const fetchedResponseDataAsJson = jsonifyValidJSONString(fetchedResponseData, true);

          responseArgs = {
            ...responseArgs,
            // @ts-ignore
            responseType,
            response: fetchedResponseData,
            responseJSON: fetchedResponseDataAsJson,
          };
        }

        customResponse = new Function("args", `return (${responseRule.editorValue})(args);`)(responseArgs);

        if (typeof customResponse === "undefined") {
          return fetchedResponse;
        }

        if (isPromise(customResponse)) {
          customResponse = await customResponse;
        }

        if (typeof customResponse === "object" && isContentTypeJSON(responseArgs?.responseType)) {
          customResponse = JSON.stringify(customResponse);
        }
      } else {
        customResponse = responseRule.editorValue;
      }

      // const requestDetails = {
      //   url,
      //   method,
      //   type: "fetch",
      //   timeStamp: Date.now(),
      // };

      // notifyResponseRuleApplied();

      const finalStatusCode = fetchedResponse?.status || 200;
      const requiresNullResponseBody = [204, 205, 304].includes(finalStatusCode);

      return new Response(requiresNullResponseBody ? null : new Blob([customResponse]), {
        status: finalStatusCode,
        statusText: fetchedResponse?.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return await getOriginalResponse();
    }
  };
};

initFetchInterceptor();
