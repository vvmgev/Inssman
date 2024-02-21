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
};
