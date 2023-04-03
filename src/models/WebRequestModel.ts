export enum WebRequestClients {
    MAIN = 'main',
    POPUP = 'POPUP',
    DEVTOOL = 'devtool'
}

export enum ListenerType {
    BEFOREREQUEST = 'beforeRequest',
    BEFORESENDHEADERS = 'beforeSendHeaders',
    HEADERSRECEIVED = 'headersReceived',
    COMPLETED = 'completed',
    ERROROCCURRED = 'errorOccurred',
}