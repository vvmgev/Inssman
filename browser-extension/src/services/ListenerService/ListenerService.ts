import generateListeners from "./listeners";

type MapListener = {
  [key: string]: Listeners;
};

type Listeners = {
  addListener: Function;
  removeListener: Function;
};

export enum ListenerType {
  ON_INSTALL = "onInstalled",
  ON_MESSAGE = "onMessage",
  ON_MESSAGE_EXTERNAL = "onMessageExternal",
  ON_UPDATE_TAB = "onUpdated",
  ON_REMOVED_TAB = "onRemoved",
  ON_BEFORE_SEND_HEADERS = "onBeforeSendHeaders",
  ON_HEADERS_RECEVIED = "onHeadersReceived",
  ON_COMPLETED = "onCompleted",
  ON_COMMITTED = "onCommitted",
  ON_CHANGE_STORAGE = "onChanged",
}

class ListenerService {
  private static instance: ListenerService;
  private events: { [key: string]: Function[] } = {};
  private mapListener: MapListener = {};
  private executeListeners: boolean = true;
  private excludedListeners: ListenerType[] = [
    ListenerType.ON_MESSAGE,
    ListenerType.ON_INSTALL,
  ];
  private constructor() {
    this.mapListener = generateListeners(this.listener);
  }

  public static getInstance = () => {
    return (
      ListenerService.instance ||
      (ListenerService.instance = new ListenerService())
    );
  };

  private on = (name: ListenerType, ...args: unknown[]): void =>
    this.getListeners(name).addListener(...args);
  private off = (name: ListenerType): void =>
    this.getListeners(name).removeListener();
  private listener =
    (name: ListenerType) =>
    (...args: unknown[]) => {
      if (!this.executeListeners && !this.excludedListeners.includes(name)) {
        return;
      }
      this.events[name].forEach((fn) => fn(...args));
    };

  public addListener = (
    name: ListenerType,
    callback: any,
    ...args: any[]
  ): void => {
    this.on(name, ...args);
    this.events[name] = this.events[name] || [];
    this.events[name].push(callback);
  };

  public removeListener = (name: ListenerType, callback: Function): void => {
    this.events[name] = this.events[name].filter((item) => item !== callback);
    if (!this.events[name].length) {
      this.off(name);
    }
  };

  private getListeners = (name: ListenerType) => {
    return {
      addListener: (...args: any[]) =>
        this.mapListener[name].addListener(...args),
      removeListener: (...args: any[]) =>
        this.mapListener[name].removeListener(...args),
    };
  };

  public toggleListeners = (toggle: boolean): void => {
    this.executeListeners = toggle;
  };
}

export default ListenerService;
