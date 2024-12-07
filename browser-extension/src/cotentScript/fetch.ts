import { ModificationType } from "@/options/pages/forms/modifyResponse/generateModifyResponseRules";
import {
  // applyDelay,
  getAbsoluteUrl,
  getCustomRequestBody,
  // getFunctionFromCode,
  // getMatchedRequestRule,
  // getMatchedResponseRule,
  isContentTypeJSON,
  isJSON,
  isPromise,
  jsonifyValidJSONString,
  // notifyOnBeforeRequest,
  // notifyRequestRuleApplied,
  // notifyResponseRuleApplied,
  shouldServeResponseWithoutRequest,
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
      const requestRule = canRequestBodyBeSent && getMatchedRuleByUrl(url);

      console.log("requestRule", requestRule);

      // getMatchedRequestRule({
      //   url: url,
      //   method: method,
      //   type: "fetch",
      //   initiator: location.origin,
      // });

      if (requestRule) {
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

      const responseRule = null as any;

      // const responseRule = getMatchedResponseRule({
      //   url,
      //   requestData,
      //   method,
      // });

      let responseHeaders;
      let fetchedResponse;

      if (responseRule && shouldServeResponseWithoutRequest(responseRule)) {
        const contentType = isJSON(responseRule.pairs[0].response.value) ? "application/json" : "text/plain";
        responseHeaders = new Headers({ "content-type": contentType });
      } else {
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
      const responseModification = responseRule.pairs[0].response;

      if (responseModification.type === "code") {
        const requestHeaders =
          request.headers &&
          // @ts-ignore
          Array.from(request.headers).reduce((obj, [key, val]) => {
            // @ts-ignore
            obj[key] = val;
            return obj;
          }, {});

        let evaluatorArgs = {
          method,
          url,
          requestHeaders,
          requestData,
        };

        if (fetchedResponse) {
          const fetchedResponseData = await fetchedResponse.text();
          const responseType = fetchedResponse.headers.get("content-type");
          const fetchedResponseDataAsJson = jsonifyValidJSONString(fetchedResponseData, true);

          evaluatorArgs = {
            ...evaluatorArgs,
            // @ts-ignore
            responseType,
            response: fetchedResponseData,
            responseJSON: fetchedResponseDataAsJson,
          };
        }

        // customResponse = getFunctionFromCode(responseModification.value, "response")(evaluatorArgs);

        if (typeof customResponse === "undefined") {
          return fetchedResponse;
        }

        // evaluator might return us Object but response.value is string
        // So make the response consistent by converting to JSON String and then create the Response object
        if (isPromise(customResponse)) {
          customResponse = await customResponse;
        }

        // @ts-ignore
        if (typeof customResponse === "object" && isContentTypeJSON(evaluatorArgs?.responseType)) {
          customResponse = JSON.stringify(customResponse);
        }
      } else {
        customResponse = responseModification.value;
      }

      const requestDetails = {
        url,
        method,
        type: "fetch",
        timeStamp: Date.now(),
      };

      // notifyResponseRuleApplied();

      // For network failures, fetchedResponse is undefined but we still return customResponse with status=200
      const finalStatusCode = parseInt(responseModification.statusCode || fetchedResponse?.status) || 200;
      const requiresNullResponseBody = [204, 205, 304].includes(finalStatusCode);

      return new Response(requiresNullResponseBody ? null : new Blob([customResponse]), {
        status: finalStatusCode,
        statusText: responseModification.statusText || fetchedResponse?.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return await getOriginalResponse();
    }
  };
};

initFetchInterceptor();
