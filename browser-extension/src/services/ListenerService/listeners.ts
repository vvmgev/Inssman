import { ListenerType } from "./ListenerService";

const generateListeners = (callback: Function) => {
  return {
    [ListenerType.ON_INSTALL]: (() => {
      const listener = callback(ListenerType.ON_INSTALL);
      return {
        addListener: () => chrome.runtime.onInstalled.addListener(listener),
        removeListener: () =>
          chrome.runtime.onInstalled.removeListener(listener),
      };
    })(),
    [ListenerType.ON_MESSAGE]: (() => {
      const listener = (...args) => {
        callback(ListenerType.ON_MESSAGE)(...args);
        // to keep the connection open must to return true
        // as inside of this callback runs async code
        return true;
      };
      return {
        addListener: () => chrome.runtime.onMessage.addListener(listener),
        removeListener: () => chrome.runtime.onMessage.removeListener(listener),
      };
    })(),
    [ListenerType.ON_MESSAGE_EXTERNAL]: (() => {
      const listener = (...args) => {
        callback(ListenerType.ON_MESSAGE_EXTERNAL)(...args);
        // to keep the connection open must to return true
        // as inside of this callback async code runs
        return true;
      };
      return {
        addListener: () =>
          chrome.runtime.onMessageExternal.addListener(listener),
        removeListener: () =>
          chrome.runtime.onMessageExternal.removeListener(listener),
      };
    })(),
    [ListenerType.ON_UPDATE_TAB]: (() => {
      const listener = callback(ListenerType.ON_UPDATE_TAB);
      return {
        addListener: () => chrome.tabs.onUpdated.addListener(listener),
        removeListener: () => chrome.tabs.onUpdated.removeListener(listener),
      };
    })(),
    [ListenerType.ON_REMOVED_TAB]: (() => {
      const listener = callback(ListenerType.ON_REMOVED_TAB);
      return {
        addListener: () => chrome.tabs.onRemoved.addListener(listener),
        removeListener: () => chrome.tabs.onRemoved.removeListener(listener),
      };
    })(),
    [ListenerType.ON_BEFORE_SEND_HEADERS]: (() => {
      const listener = callback(ListenerType.ON_BEFORE_SEND_HEADERS);
      return {
        addListener: (...args) =>
          chrome.webRequest.onBeforeSendHeaders.addListener(listener, ...args),
        removeListener: () =>
          chrome.webRequest.onBeforeSendHeaders.removeListener(listener),
      };
    })(),
    [ListenerType.ON_HEADERS_RECEVIED]: (() => {
      const listener = callback(ListenerType.ON_HEADERS_RECEVIED);
      return {
        addListener: (...args) =>
          chrome.webRequest.onHeadersReceived.addListener(listener, ...args),
        removeListener: () =>
          chrome.webRequest.onHeadersReceived.removeListener(listener),
      };
    })(),
    [ListenerType.ON_COMPLETED]: (() => {
      const listener = callback(ListenerType.ON_COMPLETED);
      return {
        addListener: (...args) =>
          chrome.webRequest.onCompleted.addListener(listener, ...args),
        removeListener: () =>
          chrome.webRequest.onCompleted.removeListener(listener),
      };
    })(),
    [ListenerType.ON_COMMITTED]: (() => {
      const listener = callback(ListenerType.ON_COMMITTED);
      return {
        addListener: (...args) =>
          chrome.webNavigation.onCommitted.addListener(listener, ...args),
        removeListener: () =>
          chrome.webNavigation.onCommitted.removeListener(listener),
      };
    })(),
    [ListenerType.ON_CHANGE_STORAGE]: (() => {
      const listener = callback(ListenerType.ON_CHANGE_STORAGE);
      return {
        addListener: () => chrome.storage.onChanged.addListener(listener),
        removeListener: () => chrome.storage.onChanged.removeListener(listener),
      };
    })(),
  };
};

export default generateListeners;
