import BaseService from "@services/BaseService";
import { WebRequestListenerType, WebRequestClients } from "@models/WebRequestModel";
import { ListenerType } from "@services/ListenerService/ListenerService";

chrome.runtime.onConnect.addListener((port) => {
  if (Object.values(WebRequestClients).includes(port.name as WebRequestClients)) {
    let WR: WebRequest | null = new WebRequest(port);
    port.onMessage.addListener((message) => {
      if (message === "disconnect") {
        port.disconnect();
        WR?.unregisterListener();
        WR = null;
      }
      if (message === "openWindow") {
        chrome.windows.create({
          url: chrome.runtime.getURL("HTTPLoggerWindow/HTTPLoggerWindow.html"),
          type: "popup",
        });
      }
    });
    port.onDisconnect.addListener(() => {
      WR?.unregisterListener();
      WR = null;
    });
  }
});

class WebRequest extends BaseService {
  urlFilterObj = { urls: ["*://*/*"] };
  port: any = null;

  constructor(port) {
    super();
    this.port = port;
    this.registerListener();
  }

  unregisterListener = (): void => {
    this.removeListener(ListenerType.ON_BEFORE_SEND_HEADERS, this.beforeSendHeaders)
      .removeListener(ListenerType.ON_HEADERS_RECEVIED, this.headersReceived)
      .removeListener(ListenerType.ON_COMPLETED, this.completed);
    this.port.disconnect();
    this.port = null;
  };

  registerListener = (): void => {
    this.addListener(ListenerType.ON_BEFORE_SEND_HEADERS, this.beforeSendHeaders, this.urlFilterObj, ["requestHeaders"])
      .addListener(ListenerType.ON_HEADERS_RECEVIED, this.headersReceived, this.urlFilterObj, ["responseHeaders"])
      .addListener(ListenerType.ON_COMPLETED, this.completed, this.urlFilterObj);
  };

  beforeRequest = (requestHeadersDetails): void => {
    this.port.postMessage({
      type: WebRequestListenerType.BEFOREREQUEST,
      requestHeadersDetails,
    });
  };

  beforeSendHeaders = (requestHeadersDetails): void => {
    this.port.postMessage({
      type: WebRequestListenerType.BEFORESENDHEADERS,
      requestHeadersDetails,
    });
  };

  headersReceived = (requestHeadersDetails): void => {
    this.port.postMessage({
      type: WebRequestListenerType.HEADERSRECEIVED,
      requestHeadersDetails,
    });
  };

  completed = (requestHeadersDetails): void => {
    this.port.postMessage({
      type: WebRequestListenerType.COMPLETED,
      requestHeadersDetails,
    });
  };

  errorOccurred = (requestHeadersDetails): void => {
    this.port.postMessage({
      type: WebRequestListenerType.ERROROCCURRED,
      requestHeadersDetails,
    });
  };
}
