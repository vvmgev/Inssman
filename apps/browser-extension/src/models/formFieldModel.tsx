import Icon from "@repo/ui/icon";
import Rule = chrome.declarativeNetRequest.Rule;
import QueryKeyValue = chrome.declarativeNetRequest.QueryKeyValue;
import RuleCondition = chrome.declarativeNetRequest.RuleCondition;
import ResourceType = chrome.declarativeNetRequest.ResourceType;
import RequestMethod = chrome.declarativeNetRequest.RequestMethod;
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type IRuleCondition = {
  resourceTypes: ResourceType[];
  excludedResourceTypes?: ResourceType[] | undefined;
} & RuleCondition;
export interface RuleWithResourceTypes extends Rule {
  condition: IRuleCondition;
}
export interface IRule extends WithOptional<RuleWithResourceTypes, "id" | "priority"> {}
export type RequestHeader = {
  header: string;
  operation: HeaderOperation;
  value: string;
  type: string;
};
export type IRuleMetaData = {
  conditions: {
    matchType: string;
    source: string;
  }[];
  id: number;
  name: string;
  pageType: string;
  enabled: boolean;
  type: string;
  requestMethods: RequestMethod[];
  resourceTypes: ResourceType[];
  lastMatchedTimestamp: number | null;
  showFields: boolean;
  // deprecated
  timestamp?: number;
  headers?: RequestHeader[];
  destination?: string;
  editorValue?: string;
  editorLang?: string;
  fileSourceType?: InjectFileSource;
  fileSource?: string;
  tagSelector?: string;
  tagSelectorOperator?: InjectFileOperator;
  shouldRemoveHeader?: boolean;
  connectedRuleIds: number[];
};

export type IForm = {
  rule: IRule;
  ruleMetaData: IRuleMetaData;
};

export enum FormMode {
  CREATE = "create",
  UPDATE = "update",
}

export enum PageType {
  REDIRECT = "redirect",
  BLOCK = "block",
  MODIFY_HEADER = "modify-header",
  MODIFY_RESPONSE = "modify-response",
  QUERY_PARAM = "query-param",
  INJECT_FILE = "inject-file",
  MODIFY_REQUEST_BODY = "modify-request-body",
  HTTP_LOGGER = "http-logger",
}

export const PageName = {
  [PageType.BLOCK]: "Block",
  [PageType.REDIRECT]: "Redirect",
  [PageType.MODIFY_RESPONSE]: "Modify Response",
  [PageType.MODIFY_HEADER]: "Modify Header",
  [PageType.QUERY_PARAM]: "Query Param",
  [PageType.MODIFY_REQUEST_BODY]: "Modify Request Body",
  [PageType.INJECT_FILE]: "Inject File",
} as const;

export const IconsMap = {
  [PageType.BLOCK]: <Icon name="block" />,
  [PageType.REDIRECT]: <Icon name="redirect" />,
  [PageType.QUERY_PARAM]: <Icon name="question" />,
  [PageType.MODIFY_HEADER]: <Icon name="code" />,
  [PageType.MODIFY_RESPONSE]: <Icon name="pencilSquare" />,
  [PageType.MODIFY_REQUEST_BODY]: <Icon name="paperClip" />,
  [PageType.INJECT_FILE]: <Icon name="wrench" />,
} as const;

export enum MatchType {
  CONTAIN = "contain",
  EQUAL = "equal",
  // REGEXP = 'regexp',
  WILDCARD = "wildcard",
}

export enum FilterType {
  URLFILTER = "urlFilter",
  REGEXFILTER = "regexFilter",
}

export const MatchTypeMap = {
  [MatchType.CONTAIN]: FilterType.URLFILTER,
  [MatchType.EQUAL]: FilterType.REGEXFILTER,
  // [MatchType.REGEXP]: FilterType.REGEXFILTER,
  [MatchType.WILDCARD]: FilterType.REGEXFILTER,
};

export enum MimeType {
  JAVASCRIPT = "text/javascript",
  HTML = "text/html",
  CSS = "text/css",
  JSON = "application/json",
}

export enum EditorLanguage {
  HTML = "html",
  CSS = "css",
  JAVASCRIPT = "javascript",
  JSON = "json",
}

export enum InjectFileType {
  CSS = "css",
  JAVASCRIPT = "javascript",
  HTML = "html",
}

export enum InjectFileTagName {
  CSS = "style",
  JAVASCRIPT = "script",
  EXTERNAL_CSS = "link",
  HTML = "span",
}

export enum InjectFileSource {
  CODE = "code",
  URL = "url",
}

export enum InjectFileOperator {
  BEFOREBEGIN = "beforebegin",
  AFTERBEGIN = "afterbegin",
  BEFOREEND = "beforeend",
  AFTEREND = "afterend",
  INNERHTML = "innerHTML",
}

export const InjectFileTagMap = {
  [InjectFileType.JAVASCRIPT]: InjectFileTagName.JAVASCRIPT,
  [InjectFileType.CSS]: InjectFileTagName.CSS,
  [InjectFileType.HTML]: InjectFileTagName.HTML,
} as const;

export const InjectFileTypeMap = {
  [InjectFileTagName.JAVASCRIPT]: MimeType.JAVASCRIPT,
  [InjectFileTagName.CSS]: MimeType.CSS,
} as const;

export const MimeTypeMap = {
  [EditorLanguage.HTML]: MimeType.HTML,
  [EditorLanguage.CSS]: MimeType.CSS,
  [EditorLanguage.JAVASCRIPT]: MimeType.JAVASCRIPT,
  [EditorLanguage.JSON]: MimeType.JSON,
} as const;

export type FormField = {
  id: number;
  priority?: number;
  matchType?: MatchType;
  pageType: PageType;
  url: string;
  extensionPath: string;
  regexSubstitution: string;
  urlFilter: string;
  regexFilter: string;
  resourceTypes: ResourceType[];
};

export enum QueryParamAction {
  ADD = "add",
  REPLACE = "replace",
  REMOVE = "remove",
}

export enum HeaderModificationType {
  REQUEST = "request",
  RESPONSE = "response",
}

export interface QueryParams extends QueryKeyValue {
  action: QueryParamAction;
}
