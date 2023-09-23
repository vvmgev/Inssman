import PencilSVG from 'assets/icons/pencil.svg';
import BlockSVG from 'assets/icons/block.svg';
import RedirectSVG from 'assets/icons/redirect.svg';
import QuestionSVG from 'assets/icons/question.svg';
import WrenchSVG from 'assets/icons/wrench.svg';
import CodeSVG from 'assets/icons/code.svg';
import PaperClipSVG from 'assets/icons/paperClip.svg';

export const FormMode = {
  CREATE: 'create',
  UPDATE: 'update',
};

export const PageType = {
  REDIRECT: 'redirect',
  BLOCK: 'block',
  MODIFY_HEADER: 'modify-header',
  MODIFY_RESPONSE: 'modify-response',
  QUERY_PARAM: 'query-param',
  INJECT_FILE: 'inject-file',
  MODIFY_REQUEST_BODY: 'modify-request-body',
  HTTP_LOGGER: 'http-logger',
};

export const PageName = {
  [PageType.BLOCK]: 'Block',
  [PageType.REDIRECT]: 'Redirect',
  [PageType.MODIFY_RESPONSE]: 'Modify Response',
  [PageType.MODIFY_HEADER]: 'Modify Header',
  [PageType.QUERY_PARAM]: 'Query Param',
  [PageType.MODIFY_REQUEST_BODY]: 'Modify Request Body',
  [PageType.INJECT_FILE]: 'Inject File',
};

export const IconsMap = {
  [PageType.BLOCK]: <BlockSVG />,
  [PageType.REDIRECT]: <RedirectSVG />,
  [PageType.QUERY_PARAM]: <QuestionSVG />,
  [PageType.MODIFY_HEADER]: <CodeSVG />,
  [PageType.MODIFY_RESPONSE]: <PencilSVG />,
  [PageType.MODIFY_REQUEST_BODY]: <PaperClipSVG />,
  [PageType.INJECT_FILE]: <WrenchSVG />,
};

export const MatchType = {
  CONTAIN: 'contain',
  EQUAL: 'equal',
  // REGEXP = 'regexp',
  WILDCARD: 'wildcard',
};

export const FilterType = {
  URLFILTER: 'urlFilter',
  REGEXFILTER: 'regexFilter',
};

export const MatchTypeMap = {
  [MatchType.CONTAIN]: FilterType.URLFILTER,
  [MatchType.EQUAL]: FilterType.REGEXFILTER,
  // [MatchType.REGEXP]: FilterType.REGEXFILTER,
  [MatchType.WILDCARD]: FilterType.REGEXFILTER,
};

export const MimeType = {
  JAVASCRIPT: 'text/javascript',
  HTML: 'text/html',
  CSS: 'text/css',
  JSON: 'application/json',
};

export const EditorLanguage = {
  HTML: 'html',
  CSS: 'css',
  JAVASCRIPT: 'javascript',
  JSON: 'json',
};

export const InjectFileType = {
  CSS: 'css',
  JAVASCRIPT: 'javascript',
  HTML: 'html',
};

export const InjectFileTagName = {
  CSS: 'style',
  JAVASCRIPT: 'script',
  EXTERNAL_CSS: 'link',
  HTML: 'span',
};

export const InjectFileSource = {
  CODE: 'code',
  URL: 'url',
};

export const InjectFileOperator = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
  INNERHTML: 'innerHTML',
};

export const InjectFileTagMap = {
  [InjectFileType.JAVASCRIPT]: InjectFileTagName.JAVASCRIPT,
  [InjectFileType.CSS]: InjectFileTagName.CSS,
  [InjectFileType.HTML]: InjectFileTagName.HTML,
};

export const InjectFileTypeMap = {
  [InjectFileTagName.JAVASCRIPT]: MimeType.JAVASCRIPT,
  [InjectFileTagName.CSS]: MimeType.CSS,
};

export const MimeTypeMap = {
  [EditorLanguage.HTML]: MimeType.HTML,
  [EditorLanguage.CSS]: MimeType.CSS,
  [EditorLanguage.JAVASCRIPT]: MimeType.JAVASCRIPT,
  [EditorLanguage.JSON]: MimeType.JSON,
};

export const QueryParamAction = {
  ADD: 'add',
  REPLACE: 'replace',
  REMOVE: 'remove',
};

export const HeaderModificationType = {
  REQUEST: 'request',
  RESPONSE: 'response',
};

export const HeaderOperation = {
  APPEND: 'append',
  SET: 'set',
  REMOVE: 'remove',
};

export const RuleActionType = {
  BLOCK: 'block',
  REDIRECT: 'redirect',
  ALLOW: 'allow',
  UPGRADE_SCHEME: 'upgradeScheme',
  MODIFY_HEADERS: 'modifyHeaders',
  ALLOW_ALL_REQUESTS: 'allowAllRequests',
};

export const ResourceType = {
  MAIN_FRAME: "main_frame",
  SUB_FRAME: "sub_frame",
  STYLESHEET: "stylesheet",
  SCRIPT: "script",
  IMAGE: "image",
  FONT: "font",
  OBJECT: "object",
  XMLHTTPREQUEST: "xmlhttprequest",
  PING: "ping",
  CSP_REPORT: "csp_report",
  MEDIA: "media",
  WEBSOCKET: "websocket",
  OTHER: "other"
}
