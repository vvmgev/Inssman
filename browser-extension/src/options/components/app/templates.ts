import { ModificationType } from "@/options/pages/forms/modifyResponse/generateModifyResponseRules";
import { EditorLanguage, InjectFileOperator, InjectFileSource, InjectFileType, PageType } from "@models/formFieldModel";

export const templates = {
  [PageType.REDIRECT]: [
    {
      id: 11,
      name: "Redirect Bing To Google",
      destination: "https://google.com",
      pageType: "redirect",
      conditions: [
        {
          source: "bing.com",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
      ],
    },
  ],
  [PageType.BLOCK]: [
    {
      id: 21,
      name: "Block Social Networks",
      pageType: "block",
      conditions: [
        {
          source: "instagram.com",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
        {
          source: "facebook.com",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
        {
          source: "tiktok.com",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
      ],
    },
  ],
  [PageType.QUERY_PARAM]: [
    {
      id: 31,
      name: "Remove UTM Params",
      pageType: "query-param",
      conditions: [
        {
          source: "",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
      ],
      queryParams: [
        {
          action: "remove",
          key: "utm_medium",
          value: "",
          enabled: true,
        },
        {
          action: "remove",
          key: "utm_source",
          value: "",
          enabled: true,
        },
        {
          action: "remove",
          key: "utm_term",
          value: "",
          enabled: true,
        },
        {
          action: "remove",
          key: "utm_campaign",
          value: "",
          enabled: true,
        },
      ],
    },
    {
      id: 32,
      name: "Remove Facebook Click Id",
      pageType: "query-param",
      conditions: [
        {
          source: "",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
      ],
      queryParams: [
        {
          action: "remove",
          key: "fbclid",
          value: "",
          enabled: true,
        },
      ],
    },
  ],
  [PageType.MODIFY_HEADER]: [
    {
      id: 41,
      headers: [
        {
          header: "Content-Security-Policy",
          operation: "remove",
          type: "response",
          value: "",
          enabled: true,
        },
      ],
      conditions: [
        {
          source: "",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
      ],
      name: "Remove Content-Security-Policy Header",
      pageType: "modify-header",
    },
    {
      id: 42,
      conditions: [
        {
          source: "",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
      ],
      headers: [
        {
          header: "Access-Control-Allow-Origin",
          operation: "set",
          type: "response",
          value: "*",
          enabled: true,
        },
        {
          header: "Access-Control-Allow-Methods",
          operation: "set",
          type: "response",
          value: "*",
          enabled: true,
        },
        {
          header: "Access-Control-Allow-Headers",
          operation: "set",
          type: "response",
          value: "*",
          enabled: true,
        },
        {
          header: "Access-Control-Allow-Credentials",
          operation: "set",
          type: "response",
          value: "true",
          enabled: true,
        },
      ],
      name: "Bypass CORS",
      pageType: "modify-header",
    },
  ],
  [PageType.MODIFY_RESPONSE]: [
    {
      id: 51,
      conditions: [
        {
          source: "https://www.youtube.com/youtubei/v1/browse?prettyPrint=false",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
      ],
      modificationType: ModificationType.DYNAMIC,
      editorLang: EditorLanguage.JAVASCRIPT,
      editorValue: `function modifyResponse(args) {
  const { response } = args;

  try {
    const replace = (string) => {
      // replace all urls
     return string.replace(/"url"\s*:\s*"[^"]*"/g, '"url": "https://placehold.co/600x400"');
    }

    return JSON.parse(replace(JSON.stringify(response)));
  } catch (error) {
    console.error(error);
    return response;
  }
}`,
      name: "Modify Response Youtube.com",
      pageType: "modify-response",
    },
    {
      id: 52,
      conditions: [
        {
          source: "https://completion.amazon.com/api/2017/suggestions",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
      ],
      modificationType: ModificationType.DYNAMIC,
      editorLang: EditorLanguage.JAVASCRIPT,
      editorValue: `function modifyResponse(args) {
  const { response } = args;

  try {
    // custom code here
      response.suggestions = response.suggestions.map(suggestion => ({
          ...suggestion,
          value: suggestion.value += ' - modified by Inssman'
      }))
      return response;
  } catch (error) {
    console.error(error);
    return response;
  }
}`,
      name: "Modify Response Amazon.com",
      pageType: "modify-response",
    },
  ],
  [PageType.INJECT_FILE]: [
    {
      id: 61,
      conditions: [
        {
          source: "inssman.com",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
          enabled: true,
        },
      ],
      editorLang: InjectFileType.JAVASCRIPT,
      fileSourceType: InjectFileSource.CODE,
      tagSelectorOperator: InjectFileOperator.AFTERBEGIN,
      tagSelector: "document.body",
      fileSource: "",
      editorValue: `document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', () => alert('body click'))
})`,
      name: "Inject File",
      pageType: "inject-file",
    },
  ],
};
