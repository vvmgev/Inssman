import { ListenerType, WebRequestClients } from "src/models/WebRequestModel";

chrome.runtime.onConnect.addListener(port => {
    if(Object.values(WebRequestClients).includes(port.name as WebRequestClients)) {
        let WR: WebRequest | null = new WebRequest(port);
        port.onMessage.addListener((message) => {
            if(message === 'disconnect') {
                port.disconnect();
                WR?.removeListener();
                WR = null;
            }
            if(message === 'openWindow') {
                chrome.windows.create({
                    url: chrome.runtime.getURL("HTTPLoggerWindow/HTTPLoggerWindow.html"),
                    type: "popup"
                });
            }     
        });
        port.onDisconnect.addListener(() => {
            WR?.removeListener();
            WR = null;
        });
    }
});

class WebRequest {
    urlFilterObj = {'urls':['*://*/*']};
    port: any = null;

    constructor(port) {
        this.port = port;
        this.registerListener();
    }

    removeListener = (): void => {
        chrome.webRequest.onBeforeSendHeaders.removeListener(this.beforeSendHeaders);
        chrome.webRequest.onHeadersReceived.removeListener(this.headersReceived);
        chrome.webRequest.onCompleted.removeListener(this.completed);
        this.port.disconnect();
        this.port = null;
    }

    registerListener = (): void => {
        chrome.webRequest.onBeforeSendHeaders.addListener(this.beforeSendHeaders, this.urlFilterObj, ["requestHeaders"]);
        chrome.webRequest.onHeadersReceived.addListener(this.headersReceived, this.urlFilterObj, ["responseHeaders"]);
        chrome.webRequest.onCompleted.addListener(this.completed, this.urlFilterObj);
    }

    beforeRequest = (requestHeadersDetails): void => {
        this.port.postMessage({type : ListenerType.BEFOREREQUEST , requestHeadersDetails});
    }

    beforeSendHeaders = (requestHeadersDetails): void => {
        this.port.postMessage({type : ListenerType.BEFORESENDHEADERS , requestHeadersDetails});
    }

    headersReceived = (requestHeadersDetails): void => {
        this.port.postMessage({type : ListenerType.HEADERSRECEIVED , requestHeadersDetails});
    }

    completed = (requestHeadersDetails): void => {
        this.port.postMessage({type : ListenerType.COMPLETED , requestHeadersDetails});
    }

    errorOccurred = (requestHeadersDetails): void => {
        this.port.postMessage({type : ListenerType.ERROROCCURRED , requestHeadersDetails});
    }
};