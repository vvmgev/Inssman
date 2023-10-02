import ListenerService from "./ListenerService/ListenerService";

class BaseService {
    private listenerService: ListenerService = ListenerService.getInstance();

    public addListener = (name: string, callback: any, ...args: any[]): BaseService => {
        this.listenerService.addListener(name, callback, ...args);
        return this;
    }

    public removeListener = (name: string, callback: Function): BaseService => {
        this.listenerService.removeListener(name, callback);
        return this;
    }
}

export default BaseService;