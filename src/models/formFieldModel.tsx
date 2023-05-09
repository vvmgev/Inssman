import React from 'react';
import PencilSVG  from 'assets/icons/pencil.svg';
import BlockSVG  from 'assets/icons/block.svg';
import RedirectSVG  from 'assets/icons/redirect.svg';
import QuestionSVG  from 'assets/icons/question.svg';
import WrenchSVG  from 'assets/icons/wrench.svg';
import CodeSVG  from 'assets/icons/code.svg';
import PaperClipSVG  from 'assets/icons/paperClip.svg';
import ResourceType = chrome.declarativeNetRequest.ResourceType
import Rule = chrome.declarativeNetRequest.Rule
import QueryKeyValue = chrome.declarativeNetRequest.QueryKeyValue
import RequestMethod = chrome.declarativeNetRequest.RequestMethod;

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export interface IRule extends WithOptional<Rule, 'id' | 'priority' >{}
export interface IRuleData {
    name: string,
    source: string,
    matchType: string,
    pageType: string,
    enabled: boolean;
    type: string,
    requestMethod: RequestMethod[],
    id?: number,
    destination?: string,
    editorValue?: string,
    editorLang?: string,
    fileSourceType?: InjectFileSource,
    fileSource?: string,
    tagSelector?: string,
    tagSelectorOperator?: InjectFileOperator,
    shouldRemoveHeader?: boolean,
    rule?: Rule,
}
export interface IForm {
    rule?: IRule,
    ruleData?: IRuleData
}

export enum FIELDS {
    SOURCE = 'source',
    NAME = 'name',
    DESTINATION = 'destination',
    FILESOURCE = 'fileSource'
}

export const ValidateFields = [FIELDS.SOURCE, FIELDS.NAME, FIELDS.DESTINATION];


export enum FormMode {
    CREATE = 'create',
    UPDATE = 'update',
}

export enum PageType {
    REDIRECT = 'redirect',
    BLOCK = 'block',
    MODIFY_HEADER = 'modify-header',
    MODIFY_RESPONSE = 'modify-response',
    QUERY_PARAM = 'query-param',
    INJECT_FILE = 'inject-file',
    MODIFY_REQUEST_BODY = 'modify-request-body',
    HTTP_LOGGER = 'http-logger',
}

export const PageTypeMap = {
    [PageType.BLOCK]: 'Block',
    [PageType.REDIRECT]: 'Redirect',
    [PageType.MODIFY_RESPONSE]: 'Modify Response',
    [PageType.MODIFY_HEADER]: 'Modify Header',
    [PageType.QUERY_PARAM]: 'Query Param',
    [PageType.MODIFY_REQUEST_BODY]: 'Modify Request Body',
    [PageType.INJECT_FILE]: 'Inject File',
}

export const IconsMap = {
    [PageType.BLOCK]: <BlockSVG />,
    [PageType.REDIRECT]: <RedirectSVG />,
    [PageType.QUERY_PARAM]: <QuestionSVG />,
    [PageType.MODIFY_HEADER]: <CodeSVG />,
    [PageType.MODIFY_RESPONSE]: <PencilSVG />,
    [PageType.MODIFY_REQUEST_BODY]: <PaperClipSVG />,
    [PageType.INJECT_FILE]: <WrenchSVG />,
};

export enum MatchType {
    CONTAIN = 'contain',
    EQUAL = 'equal',
    // REGEXP = 'regexp',
    // WILDCARD = 'wildcard'
}

export enum FilterType {
    URLFILTER = 'urlFilter',
    REGEXFILTER = 'regexFilter',
}

export const MatchTypeMap = {
    [MatchType.CONTAIN]: FilterType.URLFILTER,
    [MatchType.EQUAL]: FilterType.REGEXFILTER,
    // [MatchType.REGEXP]: FilterType.REGEXFILTER,
    // [MatchType.WILDCARD]: FilterType.REGEXFILTER,
}

export enum MimeType {
    JAVASCRIPT = 'text/javascript',
    HTML = 'text/html',
    CSS = 'text/css',
    JSON = 'application/json',
}

export enum EditorLanguage {
    HTML = 'html',
    CSS = 'css',
    JAVASCRIPT = 'javascript',
    JSON = 'json'
}

export enum InjectFileType {
    CSS = 'css',
    JAVASCRIPT = 'javascript',
    HTML = 'html',
}

export enum InjectFileTagName {
    CSS = 'style',
    JAVASCRIPT = 'script',
    EXTERNAL_CSS = 'link',
    HTML = 'span',
}

export enum InjectFileSource {
    CODE = 'code',
    URL = 'url',
}

export enum InjectFileOperator {
    BEFOREBEGIN = 'beforebegin',
    AFTERBEGIN = 'afterbegin',
    BEFOREEND = 'beforeend',
    AFTEREND = 'afterend',
    INNERHTML = 'innerHTML'
}

export const InjectFileTagMap = {
    [InjectFileType.JAVASCRIPT]: InjectFileTagName.JAVASCRIPT,
    [InjectFileType.CSS]: InjectFileTagName.CSS,
    [InjectFileType.HTML]: InjectFileTagName.HTML,
}

export const InjectFileTypeMap = {
    [InjectFileTagName.JAVASCRIPT]: MimeType.JAVASCRIPT,
    [InjectFileTagName.CSS]: MimeType.CSS,
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
    pageType: PageType;
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