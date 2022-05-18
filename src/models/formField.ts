import ResourceType = chrome.declarativeNetRequest.ResourceType
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import RequestMethod = chrome.declarativeNetRequest.RequestMethod
import Rule = chrome.declarativeNetRequest.Rule

export enum FormType {
    REDIRECT = 'Redirect Request',
    BLOCK = 'Block Request',
    REPLACE = 'Replace Reuqest',
    MODIFYHEADER = 'Modify Request Header',
    INSERTSCRIPT = 'Insert Script',
    MODIFYRESPONSE = 'Modify Response',
    DELAY = 'Delay Request',
    QUERYPARAM = 'Query Param'
}

export const FormTypeMap = {
    REDIRECT: RuleActionType.REDIRECT,
    BLOCK: RuleActionType.BLOCK,
    MODIFYRESPONSE: RuleActionType.REDIRECT
}

export enum MatchType {
    CONTAIN = 'Contain',
    EQUAL = 'Equl',
    REGEXP = 'Regexp',
    WILDCARD = 'Wildcard'
}

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export interface FormField extends WithOptional<Rule, 'id' | 'priority' | 'action' | 'condition' >{
    matchType: MatchType;
}