import ListenerService from './ListenerService/ListenerService';

class BaseService {
  #listenerService = ListenerService.getInstance();

  addListener = (name, callback, ...args) => {
    this.#listenerService.addListener(name, callback, ...args);
    return this;
  };

  removeListener = (name, callback) => {
    this.#listenerService.removeListener(name, callback);
    return this;
  };
}

export default BaseService;
