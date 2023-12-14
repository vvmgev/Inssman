// TODO move the relevant folder
export enum WebRequestClients {
  MAIN = "main",
  WINDOW = "window",
  DEVTOOL = "devtool",
}

// TODO move the relevant folder
export enum WebRequestListenerType {
  BEFOREREQUEST = "beforeRequest",
  BEFORESENDHEADERS = "beforeSendHeaders",
  HEADERSRECEIVED = "headersReceived",
  COMPLETED = "completed",
  ERROROCCURRED = "errorOccurred",
}
