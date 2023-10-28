import generateListeners from "./listeners";

type MapListener = {
    [key: string]: Listeners,
}

type Listeners = {
    addListener: Function,
    removeListener: Function,
}

export enum ListenerType {
    ON_INSTALL = 'onInstalled',
    ON_MESSAGE = 'onMessage',
    ON_MESSAGE_EXTERNAL = 'onMessageExternal',
    ON_UPDATE_TAB = 'onUpdated',
    ON_BEFORE_SEND_HEADERS = 'onBeforeSendHeaders',
    ON_HEADERS_RECEVIED = 'onHeadersReceived',
    ON_COMPLETED = 'onCompleted',
    ON_COMMITTED = 'onCommitted',
    ON_CHANGE_STORAGE = 'onChanged',
};

class ListenerService {
    private static instance: ListenerService;
    private events: {[key: string]: Function[]} = {};
    private mapListener: MapListener = {};
    private constructor() {
        this.mapListener = generateListeners(this.listener);
    }

    public static getInstance = () => {
        return ListenerService.instance || (ListenerService.instance = new ListenerService());
    }

    private on = (name: string, ...args: any[]): void => this.getListeners(name).addListener(...args);
    private off = (name: string): void => this.getListeners(name).removeListener();
    private listener = (name: string) => (...args: any[]) => this.events[name].forEach(fn => fn(...args));

    public addListener = (name: string, callback: any, ...args: any[]): void => {
        this.on(name, ...args);
        this.events[name] = (this.events[name] || []);
        this.events[name].push(callback);
    }

    public removeListener = (name: string, callback: Function): void => {
        this.events[name] = this.events[name].filter(item => item !== callback);
        if(!this.events[name].length) {
            this.off(name);
        }
    }

    private getListeners = (name: string) => {
        return {
            addListener: (...args: any[]) => this.mapListener[name].addListener(...args),
            removeListener: (...args: any[]) => this.mapListener[name].removeListener(...args),
        };
    }

};

export default ListenerService;