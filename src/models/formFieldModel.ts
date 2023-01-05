import { PostMessageAction } from "./postMessageActionModel"
import ResourceType = chrome.declarativeNetRequest.ResourceType
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import RequestMethod = chrome.declarativeNetRequest.RequestMethod
import Rule = chrome.declarativeNetRequest.Rule
import QueryKeyValue = chrome.declarativeNetRequest.QueryKeyValue
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation
import RuleCondition = chrome.declarativeNetRequest.RuleCondition

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export interface IRule extends WithOptional<Rule, 'id' | 'priority' >{}
export interface IForm {
    action?: PostMessageAction,
    data: {
        rule: IRule,
        ruleData: {
            title: string,
            source: string,
            matchType: string,
            destination?: string,
            editorValue?: string,
            editorLang?: string,
            formType: string,
        }
    }
}

export enum FormMode {
    CREATE = 'create',
    UPDATE = 'update',
}

export enum FormType {
    REDIRECT = 'redirect',
    BLOCK = 'block',
    MODIFY_HEADER = 'modify-header',
    MODIFY_RESPONSE = 'modify-response',
    QUERY_PARAM = 'query-param'
}

export const FormTypeMap = {
    [FormType.REDIRECT]: 'Redirect',
    [FormType.BLOCK]: 'Block',
    [FormType.MODIFY_RESPONSE]: 'Modify Response',
    [FormType.MODIFY_HEADER]: 'Modify Header',
    [FormType.QUERY_PARAM]: 'Query Param',
}

export enum MatchType {
    CONTAIN = 'contain',
    EQUAL = 'equal',
    REGEXP = 'regexp',
    WILDCARD = 'wildcard'
}

export enum FilterType {
    URLFILTER = 'urlFilter',
    REGEXFILTER = 'regexFilter',
}

export const MatchTypeMap = {
    [MatchType.CONTAIN]: FilterType.URLFILTER,
    [MatchType.EQUAL]: FilterType.REGEXFILTER,
    [MatchType.REGEXP]: FilterType.REGEXFILTER,
    [MatchType.WILDCARD]: FilterType.REGEXFILTER,
}

export enum EditorLanguage {
    HTML = 'html',
    CSS = 'css',
    JAVASCRIPT = 'javascript',
    JSON = 'json'
}

export enum MimeType {
    JAVASCRIPT = 'text/javascript',
    HTML = 'text/html',
    CSS = 'text/css',
    JSON = 'application/json',
}

export const MimeTypeMap = {
    [EditorLanguage.HTML]: MimeType.HTML,
    [EditorLanguage.CSS]: MimeType.CSS,
    [EditorLanguage.JAVASCRIPT]: MimeType.JAVASCRIPT,
    [EditorLanguage.JSON]: MimeType.JSON,
}

export interface FormField {
    id: number;
    priority?: number;
    matchType?: MatchType;
    formType: FormType;
    url: string;
    extensionPath: string;
    regexSubstitution: string;
    urlFilter: string;
    regexFilter: string;
    resourceTypes: ResourceType[];
}

export const FormFieldRender = [
    'name',
    'url',
    'extensionPath',
    'regexSubstitution',
    'urlFilter',
    'regexFilter',
]

export enum QueryParamAction {
    ADD = 'add',
    REPLACE = 'replace',
    REMOVE = 'remove',
}

export enum HeaderModificationType {
    REQUEST = 'request',
    RESPONSE = 'response',
}
  
  export interface QueryParams extends QueryKeyValue {
    action: QueryParamAction
}