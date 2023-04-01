export enum WebRequestClients {
    MAIN = 'main',
    TAB = 'tab',
    DEVTOOL = 'devtool'
}

export enum ListenerType {
    BEFOREREQUEST = 'beforeRequest',
    BEFORESENDHEADERS = 'beforeSendHeaders',
    HEADERSRECEIVED = 'headersReceived',
    COMPLETED = 'completed',
    ERROROCCURRED = 'errorOccurred',
}