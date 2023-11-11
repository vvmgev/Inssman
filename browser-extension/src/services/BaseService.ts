import ListenerService, { ListenerType } from "./ListenerService/ListenerService";

class BaseService {
    private listenerService: ListenerService = ListenerService.getInstance();

    public addListener = (name: ListenerType, callback: any, ...args: any[]): BaseService => {
        this.listenerService.addListener(name, callback, ...args);
        return this;
    }

    public removeListener = (name: ListenerType, callback: Function): BaseService => {
        this.listenerService.removeListener(name, callback);
        return this;
    }

    public toggleListeners = (toggle: boolean): void => {
      this.listenerService.toggleListeners(toggle);
    }
}

export default BaseService;
