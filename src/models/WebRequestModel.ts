export enum WebRequestClients {
    MAIN = 'main',
    WINDOW = 'window',
    DEVTOOL = 'devtool'
}

export enum ListenerType {
    BEFOREREQUEST = 'beforeRequest',
    BEFORESENDHEADERS = 'beforeSendHeaders',
    HEADERSRECEIVED = 'headersReceived',
    COMPLETED = 'completed',
    ERROROCCURRED = 'errorOccurred',
}