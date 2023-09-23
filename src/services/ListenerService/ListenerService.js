import generateListeners from './listeners';

export const ListenerType = {
  ON_INSTALL: 'onInstalled',
  ON_MESSAGE: 'onMessage',
  ON_MESSAGE_EXTERNAL: 'onMessageExternal',
  ON_UPDATE_TAB: 'onUpdated',
  ON_BEFORE_SEND_HEADERS: 'onBeforeSendHeaders',
  ON_HEADERS_RECEVIED: 'onHeadersReceived',
  ON_COMPLETED: 'onCompleted',
  ON_COMMITTED: 'onCommitted',
  ON_CHANGE_STORAGE: 'onChanged',
};

class ListenerService {
  static #instance;

  #events = {};

  #mapListener = {};

  constructor() {
    this.#mapListener = generateListeners(this.#listener);
  }

  static getInstance = () => ListenerService.#instance || (ListenerService.#instance = new ListenerService());

  #on = (name, ...args) => this.getListeners(name).addListener(...args);

  #off = (name) => this.getListeners(name).removeListener();

  #listener = (name) => (...args) => this.#events[name].forEach((fn) => fn(...args));

  addListener = (name, callback, ...args) => {
    this.#on(name, ...args);
    this.#events[name] = (this.#events[name] || []);
    this.#events[name].push(callback);
  };

  removeListener = (name, callback) => {
    this.#events[name] = this.#events[name].filter((item) => item !== callback);
    if (!this.#events[name].length) {
      this.#off(name);
    }
  };

  getListeners = (name) => ({
    addListener: (...args) => this.#mapListener[name].addListener(...args),
    removeListener: (...args) => this.#mapListener[name].removeListener(...args),
  });
}

export default ListenerService;
