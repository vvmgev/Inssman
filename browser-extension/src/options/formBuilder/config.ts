import {
  EditorLanguage,
  FilterType,
  HeaderModificationType,
  InjectFileOperator,
  InjectFileSource,
  InjectFileType,
  MatchType,
  MatchTypeMap,
  MimeTypeMap,
  PageType,
  QueryParamAction,
} from "src/models/formFieldModel";
import {
  addProtocol,
  encode,
  makeExactMatch,
  replaceAsterisk,
  replaceAsteriskToPlus,
  replaceVariable,
} from "src/utils";
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;
import ResourceType = chrome.declarativeNetRequest.ResourceType;

const getQueryParams = (queryParams) => {
  return queryParams
    .filter(
      (queryParam) =>
        queryParam.key.length && queryParam.action !== QueryParamAction.REMOVE
    )
    .map((queryParam) => ({
      key: queryParam.key,
      value: queryParam.value,
      replaceOnly: queryParam.action === QueryParamAction.REPLACE,
    }));
};

const getRemoveQueryParams = (queryParams) => {
  return queryParams
    .filter(
      (queryParam) =>
        queryParam.key.length && queryParam.action === QueryParamAction.REMOVE
    )
    .map((queryParam) => queryParam.key);
};

const getRequestHeaders = (headers) => {
  return headers
    .filter(
      (header) =>
        header.header.length && header.type === HeaderModificationType.REQUEST
    )
    .map((header) => ({
      header: header.header,
      operation: header.operation,
      ...(header.operation !== HeaderOperation.REMOVE && {
        value: header.value,
      }),
    }));
};

const getResponseHeaders = (headers) => {
  return headers
    .filter(
      (header) =>
        header.header.length && header.type === HeaderModificationType.RESPONSE
    )
    .map((header) => ({
      header: header.header,
      operation: header.operation,
      ...(header.operation !== HeaderOperation.REMOVE && {
        value: header.value,
      }),
    }));
};

const generateMatchType = ({
  matchType,
  source,
  pageType,
}): Record<string, string> => {
  let newSource: string = source;

  if (matchType === MatchType.EQUAL) {
    newSource = makeExactMatch(source);
  }

  if (matchType === MatchType.WILDCARD) {
    newSource =
      PageType.MODIFY_REQUEST_BODY === pageType
        ? replaceAsteriskToPlus(source)
        : replaceAsterisk(source);
  }

  return {
    [MatchTypeMap[matchType]]: newSource,
  };
};

const generateRegexSubstitution = ({
  matchType,
  pageType,
  destination,
}): Record<string, string> => {
  const redirect: Record<string, string> = {};
  if (matchType === MatchType.WILDCARD && pageType === PageType.REDIRECT) {
    redirect.regexSubstitution = replaceVariable(destination as string);
  }
  return redirect;
};

export type Validation = {
  name: string;
  regexp: RegExp;
  message: string;
};

export type Field = {
  id: number;
  type: string;
  multipleFields: boolean;
  name?: string;
  defaultValue?: unknown;
  defaultValues?: { [key: string]: unknown };
  props?: { [key: string]: unknown };
  placeholder?: string;
  validations?:
    | { [key: string]: Validation[] }
    | { [key: string]: { [key: string]: Validation[] } };
  formatters?: { [key: string]: Function };
};

export type Config = {
  [key in Exclude<PageType, PageType.HTTP_LOGGER>]: {
    fields: Field[];
    generateRule: Function;
  };
};

const config: Config = {
  [PageType.REDIRECT]: {
    fields: [
      {
        id: 100,
        type: "input",
        name: "name",
        multipleFields: false,
        defaultValue: "",
        placeholder: "Rule Name",
        validations: {
          name: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Rule Name Is Required",
            },
          ],
        },
        formatters: {
          name: (value: string): string => value.trim(),
        },
      },
      {
        id: 101,
        type: "sourceFields",
        multipleFields: true,
        defaultValues: {
          requestMethods: [],
          resourceTypes: [],
          matchType: MatchType.CONTAIN,
          source: "",
          showFields: false,
        },
        validations: {
          source: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Source Is Required",
            },
            {
              name: "emptySpace",
              regexp: /\b\s+\b/,
              message: "Source Cannot Contain Space",
            },
          ],
        },
        formatters: {
          source: (value: string) => value.trim(),
        },
      },
      {
        id: 102,
        type: "destination",
        name: "destination",
        multipleFields: false,
        defaultValue: "",
        validations: {
          destination: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Destination Is Required",
            },
            {
              name: "emptySpace",
              regexp: /\b\s+\b/,
              message: "Destination Is Cannot Contain Space",
            },
          ],
        },
        formatters: {
          destination: (value: string) => value.trim(),
        },
      },
    ],
    generateRule: (ruleMetaData) => ({
      action: {
        type: RuleActionType.REDIRECT,
        redirect: {
          ...(MatchTypeMap[ruleMetaData.matchType] === FilterType.REGEXFILTER
            ? {
                regexSubstitution:
                  ruleMetaData.matchType === MatchType.EQUAL
                    ? addProtocol(ruleMetaData.destination)
                    : replaceVariable(addProtocol(ruleMetaData.destination)),
              }
            : { url: addProtocol(ruleMetaData.destination) }),
        },
      },
      condition: {
        ...generateMatchType(ruleMetaData),
        resourceTypes: ruleMetaData.resourceTypes.length
          ? ruleMetaData.resourceTypes
          : Object.values(ResourceType),
      },
    }),
  },
  [PageType.BLOCK]: {
    fields: [
      {
        id: 200,
        type: "input",
        name: "name",
        multipleFields: false,
        defaultValue: "",
        placeholder: "Rule Name",
        validations: {
          name: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Rule Name Is Required",
            },
          ],
        },
        formatters: {
          name: (value: string) => value.trim(),
        },
      },
      {
        id: 201,
        type: "sourceFields",
        multipleFields: true,
        defaultValues: {
          requestMethods: [],
          resourceTypes: [],
          matchType: MatchType.CONTAIN,
          source: "",
          showFields: false,
        },
        validations: {
          source: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Source Is Required",
            },
            {
              name: "emptySpace",
              regexp: /\b\s+\b/,
              message: "Source Cannot Contain Space",
            },
          ],
        },
        formatters: {
          source: (value: string) => value.trim(),
        },
      },
    ],
    generateRule: (ruleMetaData) => ({
      action: {
        type: RuleActionType.BLOCK,
      },
      condition: {
        ...generateMatchType(ruleMetaData),
        resourceTypes: ruleMetaData.resourceTypes.length
          ? ruleMetaData.resourceTypes
          : Object.values(ResourceType),
      },
    }),
  },
  [PageType.QUERY_PARAM]: {
    fields: [
      {
        id: 300,
        type: "input",
        name: "name",
        multipleFields: false,
        defaultValue: "",
        placeholder: "Rule Name",
        validations: {
          name: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Rule Name Is Required",
            },
          ],
        },
        formatters: {
          name: (value: string) => value.trim(),
        },
      },
      {
        id: 301,
        type: "sourceFields",
        multipleFields: true,
        defaultValues: {
          requestMethods: [],
          resourceTypes: [],
          matchType: MatchType.CONTAIN,
          source: "",
          showFields: false,
        },
        validations: {
          source: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Source Is Required",
            },
            {
              name: "emptySpace",
              regexp: /\b\s+\b/,
              message: "Source Cannot Contain Space",
            },
          ],
        },
        formatters: {
          source: (value: string) => value.trim(),
        },
      },
      {
        id: 302,
        type: "queryParamFields",
        multipleFields: true,
        defaultValues: {
          queryParams: [{ key: "", value: "", action: QueryParamAction.ADD }],
          requestMethods: [],
          resourceTypes: [],
          matchType: MatchType.CONTAIN,
          source: "",
        },
        validations: {
          queryParams: {
            key: [
              {
                name: "required",
                regexp: /^\s*$/,
                message: "Key Is Required",
              },
            ],
          },
        },
        formatters: {
          key: (value: string) => value.trim(),
        },
      },
    ],
    generateRule: (ruleMetaData) => ({
      action: {
        type: RuleActionType.REDIRECT,
        redirect: {
          transform: {
            queryTransform: {
              addOrReplaceParams: getQueryParams(ruleMetaData.queryParams),
              removeParams: getRemoveQueryParams(ruleMetaData.queryParams),
            },
          },
          ...generateRegexSubstitution(ruleMetaData),
        },
      },
      condition: {
        ...generateMatchType(ruleMetaData),
        resourceTypes: ruleMetaData.resourceTypes.length
          ? ruleMetaData.resourceTypes
          : Object.values(ResourceType),
      },
    }),
  },
  [PageType.MODIFY_HEADER]: {
    fields: [
      {
        id: 400,
        type: "input",
        name: "name",
        multipleFields: false,
        defaultValue: "",
        placeholder: "Rule Name",
        validations: {
          name: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Rule Name Is Required",
            },
          ],
        },
        formatters: {
          name: (value: string) => value.trim(),
        },
      },
      {
        id: 401,
        type: "sourceFields",
        multipleFields: true,
        defaultValues: {
          requestMethods: [],
          resourceTypes: [],
          matchType: MatchType.CONTAIN,
          source: "",
          showFields: false,
        },
        validations: {
          source: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Source Is Required",
            },
            {
              name: "emptySpace",
              regexp: /\b\s+\b/,
              message: "Source Cannot Contain Space",
            },
          ],
        },
        formatters: {
          source: (value: string) => value.trim(),
        },
      },
      {
        id: 402,
        type: "modifyHeaderFields",
        multipleFields: true,
        defaultValues: {
          headers: [
            {
              header: "",
              operation: HeaderOperation.SET,
              value: "",
              type: HeaderModificationType.REQUEST,
            },
          ],
          requestMethods: [],
          resourceTypes: [],
          matchType: MatchType.CONTAIN,
        },
        validations: {
          headers: {
            header: [
              {
                name: "required",
                regexp: /^\s*$/,
                message: "Header Name Is Required",
              },
              {
                name: "specialSymbols",
                regexp: /[^\w!#$%&'*+\-.^`|~]/,
                message: "Header Name Cannot Special Like !#$%&'*+-.^_`|~]+$",
              },
            ],
          },
        },
        formatters: {
          header: (value: string) => value.trim(),
          value: (value: string) => value.trim(),
        },
      },
    ],
    generateRule: (ruleMetaData) => {
      const requestHeaders = getRequestHeaders(ruleMetaData.headers);
      const responseHeaders = getResponseHeaders(ruleMetaData.headers);
      return {
        action: {
          type: RuleActionType.MODIFY_HEADERS,
          ...(requestHeaders.length && { requestHeaders: requestHeaders }),
          ...(responseHeaders.length && { responseHeaders: responseHeaders }),
        },
        condition: {
          ...generateMatchType(ruleMetaData),
          resourceTypes: ruleMetaData.resourceTypes.length
            ? ruleMetaData.resourceTypes
            : Object.values(ResourceType),
        },
      };
    },
  },
  [PageType.MODIFY_RESPONSE]: {
    fields: [
      {
        id: 500,
        type: "input",
        name: "name",
        multipleFields: false,
        defaultValue: "",
        placeholder: "Rule Name",
        validations: {
          name: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Rule Name Is Required",
            },
          ],
        },
        formatters: {
          name: (value: string) => value.trim(),
        },
      },
      {
        id: 501,
        type: "sourceFields",
        multipleFields: true,
        defaultValues: {
          requestMethods: [],
          resourceTypes: [],
          matchType: MatchType.CONTAIN,
          source: "",
          showFields: false,
        },
        validations: {
          source: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Source Is Required",
            },
            {
              name: "emptySpace",
              regexp: /\b\s+\b/,
              message: "Source Cannot Contain Space",
            },
          ],
        },
        formatters: {
          source: (value: string) => value.trim(),
        },
      },
      {
        id: 502,
        type: "editorLang",
        name: "editorLang",
        multipleFields: false,
        defaultValue: EditorLanguage.HTML,
      },
      {
        id: 503,
        type: "editor",
        name: "editorValue",
        multipleFields: false,
        defaultValue: "",
      },
    ],
    generateRule: (ruleMetaData) => ({
      action: {
        type: RuleActionType.REDIRECT,
        redirect: {
          url: encode(
            MimeTypeMap[ruleMetaData.editorLang],
            ruleMetaData.editorValue
          ),
          ...generateRegexSubstitution(ruleMetaData),
        },
      },
      condition: {
        ...generateMatchType(ruleMetaData),
        resourceTypes: ruleMetaData.resourceTypes.length
          ? ruleMetaData.resourceTypes
          : Object.values(ResourceType),
      },
    }),
  },
  [PageType.INJECT_FILE]: {
    fields: [
      {
        id: 600,
        type: "input",
        name: "name",
        multipleFields: false,
        defaultValue: "",
        placeholder: "Rule Name",
        validations: {
          name: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Rule Name Is Required",
            },
          ],
        },
        formatters: {
          name: (value: string) => value.trim(),
        },
      },
      {
        id: 601,
        type: "sourceFields",
        multipleFields: true,
        props: {
          showRequestMethods: false,
          showResourceTypes: false,
        },
        defaultValues: {
          requestMethods: [],
          resourceTypes: [],
          matchType: MatchType.CONTAIN,
          source: "",
          showFields: false,
        },
        validations: {
          source: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Source Is Required",
            },
            {
              name: "emptySpace",
              regexp: /\b\s+\b/,
              message: "Source Cannot Contain Space",
            },
          ],
        },
        formatters: {
          source: (value: string) => value.trim(),
        },
      },
      {
        id: 602,
        type: "injectFileSources",
        multipleFields: true,
        defaultValues: {
          fileSource: "",
          tagSelector: "",
          fileSourceType: InjectFileSource.CODE,
          editorLang: InjectFileType.JAVASCRIPT,
          editorValue: "",
          tagSelectorOperator: InjectFileOperator.AFTERBEGIN,
        },
      },
    ],
    generateRule: (ruleMetaData) => ({
      action: {
        type: RuleActionType.MODIFY_HEADERS,
        responseHeaders: [
          {
            header: "Content-Security-Policy",
            operation: HeaderOperation.REMOVE,
          },
        ],
      },
      condition: {
        ...generateMatchType(ruleMetaData),
        resourceTypes: ruleMetaData.resourceTypes.length
          ? ruleMetaData.resourceTypes
          : Object.values(ResourceType),
      },
    }),
  },
  [PageType.MODIFY_REQUEST_BODY]: {
    fields: [
      {
        id: 600,
        type: "input",
        name: "name",
        multipleFields: false,
        defaultValue: "",
        placeholder: "Rule Name",
        validations: {
          name: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Rule Name Is Required",
            },
          ],
        },
        formatters: {
          name: (value: string) => value.trim(),
        },
      },
      {
        id: 601,
        type: "sourceFields",
        multipleFields: true,
        props: {
          showRequestMethods: false,
          showResourceTypes: false,
        },
        defaultValues: {
          requestMethods: [],
          resourceTypes: [],
          matchType: MatchType.CONTAIN,
          source: "",
          showFields: false,
        },
        validations: {
          source: [
            {
              name: "required",
              regexp: /^\s*$/,
              message: "Source Is Required",
            },
            {
              name: "emptySpace",
              regexp: /\b\s+\b/,
              message: "Source Cannot Contain Space",
            },
          ],
        },
        formatters: {
          source: (value: string) => value.trim(),
        },
      },
      {
        id: 602,
        type: "editor",
        name: "editorValue",
        multipleFields: false,
        defaultValue: EditorLanguage.JSON,
      },
    ],
    generateRule: () => null,
  },
};

export default config;
