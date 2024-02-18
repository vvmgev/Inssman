import { PageType } from "@models/formFieldModel";

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
        },
      ],
    },
  ],
  [PageType.BLOCK]: [
    {
      id: 21,
      name: "Block Instagram",
      pageType: "block",
      conditions: [
        {
          source: "instagram.com",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
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
        },
      ],
      queryParams: [
        {
          action: "remove",
          key: "utm_medium",
          value: "",
        },
        {
          action: "remove",
          key: "utm_source",
          value: "",
        },
        {
          action: "remove",
          key: "utm_term",
          value: "",
        },
        {
          action: "remove",
          key: "utm_campaign",
          value: "",
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
        },
      ],
      queryParams: [
        {
          action: "remove",
          key: "fbclid",
          value: "",
        },
      ],
    },
  ],
  [PageType.MODIFY_HEADER]: [
    {
      id: 41,
      modifyHeaders: [
        {
          header: "Content-Security-Policy",
          operation: "remove",
          type: "response",
          value: "",
        },
      ],
      conditions: [
        {
          source: "",
          matchType: "contain",
          resourceTypes: [],
          requestMethods: [],
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
        },
      ],
      modifyHeaders: [
        {
          header: "Access-Control-Allow-Origin",
          operation: "set",
          type: "response",
          value: "*",
        },
        {
          header: "Access-Control-Allow-Methods",
          operation: "set",
          type: "response",
          value: "*",
        },
        {
          header: "Access-Control-Allow-Headers",
          operation: "set",
          type: "response",
          value: "*",
        },
        {
          header: "Access-Control-Allow-Credentials",
          operation: "set",
          type: "response",
          value: "true",
        },
      ],
      name: "Bypass CORS",
      pageType: "modify-header",
    },
  ],
};
