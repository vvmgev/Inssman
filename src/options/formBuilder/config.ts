import { EditorLanguage, HeaderModificationType, InjectFileOperator, InjectFileSource, InjectFileType, MatchType, MatchTypeMap, MimeTypeMap, PageType, QueryParamAction } from "src/models/formFieldModel";
import { addProtocol, encode } from "../utils";
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation

const getQueryParams = queryParams => {
    return queryParams.filter(queryParam => queryParam.key.length && queryParam.action !== QueryParamAction.REMOVE).map(queryParam => ({
          key: queryParam.key,
          value: queryParam.value,
          replaceOnly: queryParam.action === QueryParamAction.REPLACE,
      }
    ));
};

const getRemoveQueryParams = queryParams => {
    return queryParams.filter(queryParam => queryParam.key.length && queryParam.action === QueryParamAction.REMOVE).map(queryParam => queryParam.key);
};

const getRequestHeaders = headers => {
    return headers.filter(header => header.header.length && header.type === HeaderModificationType.REQUEST).map(header => ({
      header: header.header,
      operation: header.operation,
      ...(header.operation !== HeaderOperation.REMOVE && {value: header.value})
    }))
};

const getResponseHeaders = headers => {
    return headers.filter(header => header.header.length && header.type === HeaderModificationType.RESPONSE).map(header => ({
      header: header.header,
      operation: header.operation,
      ...(header.operation !== HeaderOperation.REMOVE && {value: header.value})
    }))
};

const config = {
    [PageType.REDIRECT] : {
        fields: [
            {
                id: 100,
                type: 'input',
                name: 'name',
                multipleFields: false,
                defaultValue: '',
                placeholder: 'Rule Name',
                validations: {
                    name: [{
                        name: 'required',
                        regexp: /^\s*$/,
                        message: 'Rule Name Is Required'
                    }]
                },
                formatters: {
                    name: (value: string) => value.trim(),
                },
            },
            {
                id: 101,
                type: 'sourceFields',
                multipleFields: true,
                defaultValues: {
                    requestMethods: [],
                    matchType: MatchType.CONTAIN,
                    source: '',
                },
                validations: {
                    source: [
                        {
                            name: 'required',
                            regexp: /^\s*$/,
                            message: 'Source Is Required'
                        },
                        {
                            name: 'emptySpace',
                            regexp: /\b\s+\b/,
                            message: 'Source Is Cannot Contain Space'
                        }
                    ]
                },
                formatters: {
                    source: (value: string) => value.trim(),
                },
            },
            {
                id: 102,
                type: 'destination',
                name: 'destination',
                multipleFields: false,
                defaultValue: '',
                validations: {
                    destination: [{
                        name: 'required',
                        regexp: /^\s*$/,
                        message: 'Destination Is Required'
                    },
                    {
                        name: 'emptySpace',
                        regexp: /\b\s+\b/,
                        message: 'Destination Is Cannot Contain Space'
                    }]
                },
            },
        ],
        generateRule: ruleData => ({
            action: {
                type: RuleActionType.REDIRECT,
                redirect: {
                  url: addProtocol(ruleData.destination),
                }
              },
              condition: {
                [MatchTypeMap[ruleData.matchType]]: ruleData.source,
              }
          })
    },
    [PageType.BLOCK] : {
        fields: [
            {
                id: 200,
                type: 'input',
                name: 'name',
                multipleFields: false,
                defaultValue: '',
                placeholder: 'Rule Name',
                validations: {
                    name: [{
                        name: 'required',
                        regexp: /^\s*$/,
                        message: 'Rule Name Is Required'
                    }]
                },
                formatters: {
                    name: (value: string) => value.trim(),
                },
            },
            {
                id: 201,
                type: 'sourceFields',
                multipleFields: true,
                defaultValues: {
                    requestMethods: [],
                    matchType: MatchType.CONTAIN,
                    source: '',
                },
                validations: {
                    source: [
                        {
                            name: 'required',
                            regexp: /^\s*$/,
                            message: 'Source Is Required'
                        },
                        {
                            name: 'emptySpace',
                            regexp: /\b\s+\b/,
                            message: 'Source Is Cannot Contain Space'
                        }
                    ]
                },
                formatters: {
                    source: (value: string) => value.trim(),
                },
            },
        ],
        generateRule: ruleData => ({
            action: {
              type: RuleActionType.BLOCK,
            },
            condition: {
              [MatchTypeMap[ruleData.matchType]]: ruleData.source,
            }
          })
    },
    [PageType.QUERY_PARAM] : {
        fields: [
            {
                id: 300,
                type: 'input',
                name: 'name',
                multipleFields: false,
                defaultValue: '',
                placeholder: 'Rule Name',
                validations: {
                    name: [{
                        name: 'required',
                        regexp: /^\s*$/,
                        message: 'Rule Name Is Required'
                    }]
                },
                formatters: {
                    name: (value: string) => value.trim(),
                },

            },
            {
                id: 301,
                type: 'sourceFields',
                multipleFields: true,
                defaultValues: {
                    requestMethods: [],
                    matchType: MatchType.CONTAIN,
                    source: '',
                },
                validations: {
                    source: [
                        {
                            name: 'required',
                            regexp: /^\s*$/,
                            message: 'Source Is Required'
                        },
                        {
                            name: 'emptySpace',
                            regexp: /\b\s+\b/,
                            message: 'Source Is Cannot Contain Space'
                        }
                    ]
                },
                formatters: {
                    source: (value: string) => value.trim(),
                },
            },
            {
                id: 302,
                type: 'queryParamFields',
                multipleFields: true,
                defaultValues: {
                    queryParams: [{key: '', value: '', action: QueryParamAction.ADD}],
                    requestMethods: [],
                    matchType: MatchType.CONTAIN,
                    source: '',
                },
                validations: {
                    queryParams: {
                        key: [
                            {
                                name: 'required',
                                regexp: /^\s*$/,
                                message: 'Key Is Required'
                            },
                        ],
                    }
                },
                formatters: {
                    key: (value: string) => value.trim(),
                },
                
            },
        ],
        generateRule: ruleData => ({
            action: {
                type: RuleActionType.REDIRECT,
                redirect: {
                  transform:{
                    queryTransform: {
                      addOrReplaceParams: getQueryParams(ruleData.queryParams),
                      removeParams: getRemoveQueryParams(ruleData.queryParams),
                    }
                  }
                }
              },
              condition: {
                [MatchTypeMap[ruleData.matchType]]: ruleData.source,
              }
          })
    },
    [PageType.MODIFY_HEADER] : {
        fields: [
            {
                id: 400,
                type: 'input',
                name: 'name',
                multipleFields: false,
                defaultValue: '',
                placeholder: 'Rule Name',
                validations: {
                    name: [{
                        name: 'required',
                        regexp: /^\s*$/,
                        message: 'Rule Name Is Required'
                    }]
                },
                formatters: {
                    name: (value: string) => value.trim(),
                },
            },
            {
                id: 401,
                type: 'sourceFields',
                multipleFields: true,
                defaultValues: {
                    requestMethods: [],
                    matchType: MatchType.CONTAIN,
                    source: '',
                },
                validations: {
                    source: [
                        {
                            name: 'required',
                            regexp: /^\s*$/,
                            message: 'Source Is Required'
                        },
                        {
                            name: 'emptySpace',
                            regexp: /\b\s+\b/,
                            message: 'Source Is Cannot Contain Space'
                        }
                    ]
                },
                formatters: {
                    source: (value: string) => value.trim(),
                },
            },
            {
                id: 402,
                type: 'modifyHeaderFields',
                multipleFields: true,
                defaultValues: {
                    headers: [{header: '', operation: HeaderOperation.SET, value: '', type: HeaderModificationType.REQUEST}],
                    requestMethods: [],
                    matchType: MatchType.CONTAIN,
                },
                validations: {
                    headers: {
                        header: [
                            {
                                name: 'required',
                                regexp: /^\s*$/,
                                message: 'Header Is Required'
                            },
                            {
                                name: 'emptySpace',
                                regexp: /\b\s+\b/,
                                message: 'Header Is Cannot Contain Space'
                            }
                        ],
                    }
                },
                formatters: {
                    header: (value: string) => value.trim(),
                    value: (value: string) => value.trim(),
                },
            },
        ],
        generateRule: ruleData => {
            const requestHeaders = getRequestHeaders(ruleData.headers);
            const responseHeaders = getResponseHeaders(ruleData.headers);
            return {action: {
                type: RuleActionType.MODIFY_HEADERS,
                ...(requestHeaders.length && {requestHeaders: requestHeaders}),
                ...(responseHeaders.length && {responseHeaders: responseHeaders})
        
              },
              condition: {
                [MatchTypeMap[ruleData.matchType]]: ruleData.source,
              }
          }}
    },
    [PageType.MODIFY_RESPONSE] : {
        fields: [
            {
                id: 500,
                type: 'input',
                name: 'name',
                multipleFields: false,
                defaultValue: '',
                placeholder: 'Rule Name',
                validations: {
                    name: [{
                        name: 'required',
                        regexp: /^\s*$/,
                        message: 'Rule Name Is Required'
                    }]
                },
                formatters: {
                    name: (value: string) => value.trim(),
                },
            },
            {
                id: 501,
                type: 'sourceFields',
                multipleFields: true,
                defaultValues: {
                    requestMethods: [],
                    matchType: MatchType.CONTAIN,
                    source: '',
                },
                validations: {
                    source: [
                        {
                            name: 'required',
                            regexp: /^\s*$/,
                            message: 'Source Is Required'
                        },
                        {
                            name: 'emptySpace',
                            regexp: /\b\s+\b/,
                            message: 'Source Is Cannot Contain Space'
                        }
                    ]
                },
                formatters: {
                    source: (value: string) => value.trim(),
                },
            },
            {
                id: 502,
                type: 'editorLang',
                name: 'editorLang',
                multipleFields: false,
                defaultValue: EditorLanguage.HTML,
            },
            {
                id: 503,
                type: 'editor',
                name: 'editorValue',
                multipleFields: false,
                defaultValue: '',
            },
        ],
        generateRule: ruleData => ({
            action: {
                type: RuleActionType.REDIRECT,
                redirect: {
                  url: encode(MimeTypeMap[ruleData.editorLang], ruleData.editorValue),
                }
              },
              condition: {
                [MatchTypeMap[ruleData.matchType]]: ruleData.source,
              }
        })
    },
    [PageType.INJECT_FILE] : {
        fields: [
            {
                id: 600,
                type: 'input',
                name: 'name',
                multipleFields: false,
                defaultValue: '',
                placeholder: 'Rule Name',
                validations: {
                    name: [{
                        name: 'required',
                        regexp: /^\s*$/,
                        message: 'Rule Name Is Required'
                    }]
                },
                formatters: {
                    name: (value: string) => value.trim(),
                },

            },
            {
                id: 601,
                type: 'sourceFields',
                multipleFields: true,
                defaultValues: {
                    requestMethods: [],
                    matchType: MatchType.CONTAIN,
                    source: '',
                },
                validations: {
                    source: [
                        {
                            name: 'required',
                            regexp: /^\s*$/,
                            message: 'Source Is Required'
                        },
                        {
                            name: 'emptySpace',
                            regexp: /\b\s+\b/,
                            message: 'Source Is Cannot Contain Space'
                        }
                    ]
                },
                formatters: {
                    source: (value: string) => value.trim(),
                },
            },
            {
                id: 602,
                type: 'injectFileSources',
                multipleFields: true,
                defaultValues: {
                    fileSource: '',
                    tagSelector: '',
                    fileSourceType: InjectFileSource.CODE,
                    editorLang: InjectFileType.JAVASCRIPT,
                    editorValue: '',
                    tagSelectorOperator: InjectFileOperator.AFTERBEGIN
                },
                
            }
        ],
        generateRule: ruleData => ({
            action: {
                type: RuleActionType.MODIFY_HEADERS,
                responseHeaders: [{
                    header: 'Content-Security-Policy',
                    operation: HeaderOperation.REMOVE
                  }
                ]
              },
              condition: {
                [MatchTypeMap[ruleData.matchType]]: ruleData.source,
              }
        })
    },
    [PageType.MODIFY_REQUEST_BODY] : {
        fields: [
            {
                id: 600,
                type: 'input',
                name: 'name',
                multipleFields: false,
                defaultValue: '',
                placeholder: 'Rule Name',
                validations: {
                    name: [{
                        name: 'required',
                        regexp: /^\s*$/,
                        message: 'Rule Name Is Required'
                    }]
                },
                formatters: {
                    name: (value: string) => value.trim(),
                },
            },
            {
                id: 601,
                type: 'sourceFields',
                multipleFields: true,
                defaultValues: {
                    requestMethods: [],
                    matchType: MatchType.CONTAIN,
                    source: '',
                },
                validations: {
                    source: [
                        {
                            name: 'required',
                            regexp: /^\s*$/,
                            message: 'Source Is Required'
                        },
                        {
                            name: 'emptySpace',
                            regexp: /\b\s+\b/,
                            message: 'Source Is Cannot Contain Space'
                        }
                    ]
                },
                formatters: {
                    source: (value: string) => value.trim(),
                },
            },
            {
                id: 602,
                type: 'editor',
                name: 'editorValue',
                multipleFields: false,
                defaultValue: EditorLanguage.JSON,
            },
        ],
        generateRule: () => null
    }
};

export default config;