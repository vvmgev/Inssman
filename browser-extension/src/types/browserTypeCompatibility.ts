if (process.env.BROWSER === "firefox") {
  enum HeaderOperation {
    APPEND = "append",
    SET = "set",
    REMOVE = "remove",
  }

  enum RequestMethod {
    CONNECT = "connect",
    DELETE = "delete",
    GET = "get",
    HEAD = "head",
    OPTIONS = "options",
    PATCH = "patch",
    POST = "post",
    PUT = "put",
  }

  enum RuleActionType {
    BLOCK = "block",
    REDIRECT = "redirect",
    ALLOW = "allow",
    UPGRADE_SCHEME = "upgradeScheme",
    MODIFY_HEADERS = "modifyHeaders",
    ALLOW_ALL_REQUESTS = "allowAllRequests",
  }

  chrome.declarativeNetRequest.HeaderOperation = HeaderOperation;
  chrome.declarativeNetRequest.RequestMethod = RequestMethod;
  chrome.declarativeNetRequest.RuleActionType = RuleActionType;
}
