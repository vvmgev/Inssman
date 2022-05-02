import { ConcatenationScope } from "node_modules/webpack/types";
import ResourceType = chrome.declarativeNetRequest.ResourceType
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import RequestMethod = chrome.declarativeNetRequest.RequestMethod
import Rule = chrome.declarativeNetRequest.Rule

export enum MatchType {
    EQUAL,
    CONTAIN,
    REGEXP,
    WILDCARD
}

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export interface FormField extends WithOptional<Rule, 'id' | 'priority' | 'action' | 'condition' >{
    matchType: MatchType;
}