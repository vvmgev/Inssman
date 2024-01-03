import { PageType } from "@models/formFieldModel";

export const templates = {
  [PageType.REDIRECT]: [
    {
      id: 11,
      name: "Redirect Bing To Google",
      destination: "https://google.com",
      pageType: "redirect",
      source: "bing.com",
      matchType: "contain",
      resourceTypes: [],
      requestMethods: [],
    },
  ],
  [PageType.BLOCK]: [
    {
      id: 21,
      name: "Block Instagram",
      pageType: "block",
      source: "instagram.com",
      matchType: "contain",
      resourceTypes: [],
      requestMethods: [],
    },
  ],
  [PageType.QUERY_PARAM]: [
    {
      id: 31,
      name: "Remove UTM Params",
      pageType: "query-param",
      matchType: "contain",
      resourceTypes: [],
      requestMethods: [],
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
      source: "",
    },
    {
      id: 32,
      name: "Remove Facebook Click Id",
      pageType: "query-param",
      matchType: "contain",
      resourceTypes: [],
      requestMethods: [],
      queryParams: [
        {
          action: "remove",
          key: "fbclid",
          value: "",
        },
      ],
      source: "",
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
        },
      ],
      matchType: "contain",
      name: "Remove Content-Security-Policy Header",
      pageType: "modify-header",
      resourceTypes: [],
      requestMethods: [],
      source: "",
    },
    {
      id: 42,
      headers: [
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
      matchType: "contain",
      name: "Bypass CORS",
      pageType: "modify-header",
      source: "",
      resourceTypes: [],
      requestMethods: [],
    },
  ],
};
