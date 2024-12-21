import { ModificationType } from "@pages/forms/modifyResponse/generateModifyResponseRules";
import { PageType } from "@models/formFieldModel";
import {
  // applyDelay,
  getAbsoluteUrl,
  // getCustomRequestBody,
  getMatchedRuleByUrl,
  // getFunctionFromCode,
  // getMatchedDelayRule,
  // getMatchedRequestRule,
  // getMatchedResponseRule,
  isContentTypeJSON,
  isJSON,
  isPromise,
  jsonifyValidJSONString,
  // notifyOnBeforeRequest,
  // notifyRequestRuleApplied,
  // notifyResponseRuleApplied,
} from "@utils/contentScript";

export const initXhrInterceptor = () => {
  const updateXhrReadyState = (xhr, readyState) => {
    Object.defineProperty(xhr, "readyState", { writable: true });
    xhr.readyState = readyState;
    xhr.dispatchEvent(new CustomEvent("readystatechange"));
  };

  const OriginalXMLHttpRequest = XMLHttpRequest;

  const createProxyXHRObject = function () {
    // @ts-ignore
    const actualXhr = this;

    const dispatchEventToActualXHR = (type, e = {} as any) => {
      actualXhr.dispatchEvent(
        new ProgressEvent(type, {
          lengthComputable: e?.lengthComputable,
          loaded: e?.loaded,
          total: e?.total,
        })
      );
    };

    const updateActualXHRReadyState = (readyState) => {
      updateXhrReadyState(actualXhr, readyState);
    };

    const onReadyStateChange = async function () {
      // @ts-ignore
      if (!this.responseRule) {
        return;
      }
      // @ts-ignore
      if (this.readyState === this.HEADERS_RECEIVED) {
        // For network failures, responseStatus=0 but we still return customResponse with status=200
        // @ts-ignore
        const responseStatus = this.status || 200;
        // @ts-ignore
        const responseStatusText = this.statusText;

        Object.defineProperties(actualXhr, {
          status: {
            get: () => responseStatus,
          },
          statusText: {
            get: () => responseStatusText,
          },
          getResponseHeader: {
            // @ts-ignore
            value: this.getResponseHeader.bind(this),
          },
          getAllResponseHeaders: {
            // @ts-ignore
            value: this.getAllResponseHeaders.bind(this),
          },
        });
        // @ts-ignore
        updateActualXHRReadyState(this.HEADERS_RECEIVED);
        // @ts-ignore
      } else if (this.readyState === this.DONE) {
        // @ts-ignore
        const responseType = this.responseType;
        // @ts-ignore
        const contentType = this.getResponseHeader("content-type");

        let customResponse;

        // @ts-ignore
        if (this.responseRule.modificationType === ModificationType.DYNAMIC) {
          const responseArgs = {
            // @ts-ignore
            method: this._method,
            // @ts-ignore
            url: this._requestURL,
            // @ts-ignore
            requestHeaders: this._requestHeaders,
            // @ts-ignore
            requestData: jsonifyValidJSONString(this._requestData),
            // @ts-ignore
            responseType: contentType,
            // @ts-ignore
            response: this.response,
            // @ts-ignore
            responseJSON: jsonifyValidJSONString(this.response, true),
          };

          // @ts-ignore
          customResponse = new Function("args", `return (${this.responseRule.editorValue})(args);`)(responseArgs);
        } else {
          // @ts-ignore
          customResponse = this.responseRule.editorValue;
        }

        if (typeof customResponse === "undefined") {
          return;
        }

        // Convert customResponse back to rawText
        // response.value is String and evaluator method might return string/object
        if (isPromise(customResponse)) {
          customResponse = await customResponse;
        }

        const isUnsupportedResponseType = responseType && !["json", "text"].includes(responseType);

        // We do not support statically modifying responses of type - blob, arraybuffer, document etc.
        // @ts-ignore
        if (this.responseRule.modificationType === ModificationType.STATIC && isUnsupportedResponseType) {
          // @ts-ignore
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
        Object.defineProperty(actualXhr, "response", {
          get: function () {
            if (this.responseRule.modificationType === ModificationType.STATIC && responseType === "json") {
              if (typeof customResponse === "object") {
                return customResponse;
              }

              return jsonifyValidJSONString(customResponse);
            }

            return customResponse;
          },
        });

        if (responseType === "" || responseType === "text") {
          Object.defineProperty(actualXhr, "responseText", {
            get: function () {
              return customResponse;
            },
          });
        }

        // @ts-ignore
        const responseURL = this.responseURL;
        // @ts-ignore
        const responseXML = this.responseXML;

        Object.defineProperties(actualXhr, {
          responseType: {
            get: function () {
              return responseType;
            },
          },
          responseURL: {
            get: function () {
              return responseURL;
            },
          },
          responseXML: {
            get: function () {
              return responseXML;
            },
          },
        });

        // const requestDetails = {
        //   url: this._requestURL,
        //   method: this._method,
        //   type: "xmlhttprequest",
        //   timeStamp: Date.now(),
        // };

        // mark resolved)
        // @ts-ignore
        if (this._abort) {
          // Note: This might get delayed due to async in code block
          dispatchEventToActualXHR("abort");
          dispatchEventToActualXHR("loadend");
        } else {
          // @ts-ignore
          updateActualXHRReadyState(this.DONE);
          dispatchEventToActualXHR("load");
          dispatchEventToActualXHR("loadend");
        }

        // notifyResponseRuleApplied({
        //   ruleDetails: this.responseRule,
        //   requestDetails,
        // });
      } else {
        // @ts-ignore
        updateActualXHRReadyState(this.readyState);
      }
    };

    const xhr = new OriginalXMLHttpRequest();
    xhr.addEventListener("readystatechange", onReadyStateChange.bind(xhr), false);
    xhr.addEventListener("abort", dispatchEventToActualXHR.bind(xhr, "abort"), false);
    xhr.addEventListener("error", dispatchEventToActualXHR.bind(xhr, "error"), false);
    xhr.addEventListener("timeout", dispatchEventToActualXHR.bind(xhr, "timeout"), false);
    xhr.addEventListener("loadstart", dispatchEventToActualXHR.bind(xhr, "loadstart"), false);
    xhr.addEventListener("progress", dispatchEventToActualXHR.bind(xhr, "progress"), false);

    // @ts-ignore
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), "timeout");

    // FIXME: This is breaking for some websites.
    // https://linear.app/requestly/issue/ENGG-1823
    if (descriptor) {
      Object.defineProperty(actualXhr, "timeout", {
        get: function () {
          // @ts-ignore
          return descriptor.get.call(this);
        },
        set: function (value) {
          xhr.timeout = value;
          // @ts-ignore
          descriptor.set.call(this, value);
        },
      });
    }

    // @ts-ignore
    this._xhr = xhr;
  };

  // @ts-ignore
  XMLHttpRequest = function () {
    const xhr = new OriginalXMLHttpRequest();
    createProxyXHRObject.call(xhr);
    return xhr;
  };

  XMLHttpRequest.prototype = OriginalXMLHttpRequest.prototype;
  Object.entries(OriginalXMLHttpRequest).map(([key, val]) => {
    XMLHttpRequest[key] = val;
  });

  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, async = true) {
    // @ts-ignore
    open.apply(this, arguments);
    try {
      // @ts-ignore
      this._xhr._method = method;
      // @ts-ignore
      this._xhr._requestURL = getAbsoluteUrl(url);
      // @ts-ignore
      this._xhr._async = async;
      // @ts-ignore
      open.apply(this._xhr, arguments);
    } catch (err) {}
  };

  const abort = XMLHttpRequest.prototype.abort;
  XMLHttpRequest.prototype.abort = function () {
    // @ts-ignore
    abort.apply(this, arguments);
    try {
      // @ts-ignore
      this._xhr._abort = true;
      // @ts-ignore
      abort.apply(this._xhr, arguments);
    } catch (err) {}
  };

  let setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    // @ts-ignore
    setRequestHeader.apply(this, arguments);
    try {
      // @ts-ignore
      this._xhr._requestHeaders = this._xhr._requestHeaders || {};
      // @ts-ignore
      this._xhr._requestHeaders[header] = value;
      // @ts-ignore
      setRequestHeader.apply(this._xhr, arguments);
    } catch (err) {}
  };

  const send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = async function (data) {
    try {
      // @ts-ignore
      if (!this._xhr._async) {
        return send.call(this, data);
      }

      // @ts-ignore
      this._xhr._requestData = data;

      // const matchedDelayRulePair = getMatchedDelayRule({
      //   url: this._xhr._requestURL,
      //   method: this._xhr._method,
      //   type: "xmlhttprequest",
      //   initiator: location.origin, // initiator=origin. Should now contain port and protocol
      // });
      // if (matchedDelayRulePair) {
      //   debug && console.log("[xhrInterceptor] matchedDelayRulePair", { matchedDelayRulePair });
      //   await applyDelay(matchedDelayRulePair.delay);
      // }

      const { [PageType.MODIFY_REQUEST_BODY]: requestRule, [PageType.MODIFY_RESPONSE]: responseRule }: any =
        // @ts-ignore
        getMatchedRuleByUrl(this._xhr._requestURL);

      console.log("requestRule", requestRule);

      if (requestRule) {
        if (requestRule.modificationType === ModificationType.DYNAMIC) {
          // @ts-ignore
          this._xhr._requestData = new Function("args", `return (${requestRule.editorValue})(args);`)({
            body: data,
            // @ts-ignore
            method: this._xhr.method,
            // @ts-ignore
            url: this._xhr._requestURL,
          });
        } else {
          // @ts-ignore
          this._xhr._requestData = requestRule.editorValue;
        }

        // notifyRequestRuleApplied({
        //   ruleDetails: requestRule,
        //   requestDetails: {
        //     // @ts-ignore
        //     url: this._xhr._requestURL,
        //     // @ts-ignore
        //     method: this._xhr._method,
        //     type: "xmlhttprequest",
        //     timeStamp: Date.now(),
        //   },
        // });
      }

      // await notifyOnBeforeRequest({
      //   // @ts-ignore
      //   url: this._xhr._requestURL,
      //   // @ts-ignore
      //   method: this._xhr._method,
      //   type: "xmlhttprequest",
      //   initiator: location.origin,
      //   // @ts-ignore
      //   requestHeaders: this._xhr._requestHeaders ?? {},
      // });

      // @ts-ignore
      this.responseRule = responseRule;
      // @ts-ignore
      this._xhr.responseRule = this.responseRule;

      // @ts-ignore
      if (this.responseRule) {
        // @ts-ignore
        send.call(this._xhr, this._xhr._requestData);
        return;
      }

      // @ts-ignore
      send.call(this, this._xhr._requestData);
    } catch (err) {
      send.call(this, data);
    }
  };
};

initXhrInterceptor();
