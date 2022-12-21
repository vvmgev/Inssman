import ResourceType = chrome.declarativeNetRequest.ResourceType
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import RequestMethod = chrome.declarativeNetRequest.RequestMethod
import Rule = chrome.declarativeNetRequest.Rule

export enum FormType {
    REDIRECT = 'Redirect Request',
    BLOCK = 'Block Request',
    // REPLACE = 'Replace Reuqest',
    // MODIFY_HEADER = 'Modify Request Header',
    // INSERT_SCRIPT = 'Insert Script',
    MODIFY_RESPONSE = 'Modify Response',
    // DELAY = 'Delay Request',
    // QUERY_PARAM = 'Query Param'
}

export const FormTypeMap = {
    REDIRECT: RuleActionType.REDIRECT,
    BLOCK: RuleActionType.BLOCK,
    MODIFY_RESPONSE: RuleActionType.REDIRECT
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

export enum Language {
    JAVASCRIPT = 'JavaScript',
    HTML = 'Html',
    CSS = 'Css',
    JSON = 'Json'
}

export enum MimeType {
    JAVASCRIPT = 'text/javascript',
    HTML = 'text/html',
    CSS = 'text/css',
    JSON = 'application/json',
}

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
// export interface FormField extends WithOptional<Rule, 'id' | 'priority' | 'action' | 'condition' >{
//     matchType: MatchType;
//     formType: FormType;
//     url: 
// }
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