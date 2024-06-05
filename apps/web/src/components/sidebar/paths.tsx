import Icon from "@repo/ui/icon";

export enum PageType {
  REDIRECT = "redirect",
  BLOCK = "block",
  MODIFY_HEADER = "modify-header",
  MODIFY_RESPONSE = "modify-response",
  QUERY_PARAM = "query-param",
  INJECT_FILE = "inject-file",
  MODIFY_REQUEST_BODY = "modify-request-body",
  HTTP_LOGGER = "http-logger",
}

export const paths = [
  {
    path: PageType.REDIRECT,
    text: "Redirect Request",
    icon: <Icon name="redirect" />,
  },
  {
    path: PageType.BLOCK,
    text: "Block Request",
    icon: <Icon name="block" />,
  },
  {
    path: PageType.QUERY_PARAM,
    text: "Query Param",
    icon: <Icon name="question" />,
  },
  {
    path: PageType.MODIFY_HEADER,
    text: "Modify Header",
    icon: <Icon name="code" />,
  },
  {
    path: PageType.MODIFY_RESPONSE,
    text: "Modify Response",
    icon: <Icon name="pencilSquare" />,
  },
  {
    path: PageType.INJECT_FILE,
    text: "Inject File",
    icon: <Icon name="wrench" />,
  },
  {
    path: PageType.MODIFY_REQUEST_BODY,
    text: "Modify Request Body",
    icon: <Icon name="paperClip" />,
  },
  {
    path: PageType.HTTP_LOGGER,
    text: "HTTP Logger",
    icon: <Icon name="listBullet" />,
  },
];

export const popularPaths = [PageType.MODIFY_HEADER, PageType.REDIRECT];

export const templates: any = {
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
