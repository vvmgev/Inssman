import React from 'react';
import PencilSVG  from 'assets/icons/pencil.svg';
import BlockSVG  from 'assets/icons/block.svg';
import RedirectSVG  from 'assets/icons/redirect.svg';
import QuestionSVG  from 'assets/icons/question.svg';
import CodeSVG  from 'assets/icons/code.svg';
import ResourceType = chrome.declarativeNetRequest.ResourceType
import Rule = chrome.declarativeNetRequest.Rule
import QueryKeyValue = chrome.declarativeNetRequest.QueryKeyValue

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export interface IRule extends WithOptional<Rule, 'id' | 'priority' >{}
export interface IRuleData {
    name: string,
    source: string,
    matchType: string,
    formType: string,
    destination?: string,
    editorValue?: string,
    editorLang?: string,
}
export interface IForm {
    rule: IRule,
    ruleData?: IRuleData
}

export enum FIELDS {
    SOURCE = 'source',
    NAME = 'name',
    DESTINATION = 'destination',
}

export const ValidateFields = [FIELDS.SOURCE, FIELDS.NAME, FIELDS.DESTINATION]


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
    [FormType.BLOCK]: 'Block',
    [FormType.REDIRECT]: 'Redirect',
    [FormType.MODIFY_RESPONSE]: 'Modify Response',
    [FormType.MODIFY_HEADER]: 'Modify Header',
    [FormType.QUERY_PARAM]: 'Query Param',
}

export const IconsMap = {
    [FormType.BLOCK]: <BlockSVG />,
    [FormType.REDIRECT]: <RedirectSVG />,
    [FormType.QUERY_PARAM]: <QuestionSVG />,
    [FormType.MODIFY_HEADER]: <CodeSVG />,
    [FormType.MODIFY_RESPONSE]: <PencilSVG />,
};

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