import CodeSVG from "../../../../assets/icons/code.svg";
import RedirectSVG from "../../../../assets/icons/redirect.svg";
import BlockSVG from "../../../../assets/icons/block.svg";
import QuestionSVG from "../../../../assets/icons/question.svg";
import PencilSquareSVG from "../../../../assets/icons/pencilSquare.svg";
import ListBulletSVG from "../../../../assets/icons/listBullet.svg";
import PaperClipSVG from "../../../../assets/icons/paperClip.svg";
import WrenchSVG from "../../../../assets/icons/wrench.svg";

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
    icon: RedirectSVG,
  },
  {
    path: PageType.BLOCK,
    text: "Block Request",
    icon: BlockSVG,
  },
  {
    path: PageType.QUERY_PARAM,
    text: "Query Param",
    icon: QuestionSVG,
  },
  {
    path: PageType.MODIFY_HEADER,
    text: "Modify Header",
    icon: CodeSVG,
  },
  {
    path: PageType.MODIFY_RESPONSE,
    text: "Modify Response",
    icon: PencilSquareSVG,
  },
  {
    path: PageType.INJECT_FILE,
    text: "Inject File",
    icon: WrenchSVG,
  },
  {
    path: PageType.MODIFY_REQUEST_BODY,
    text: "Modify Request Body",
    icon: PaperClipSVG,
  },
  {
    path: PageType.HTTP_LOGGER,
    text: "HTTP Logger",
    icon: ListBulletSVG,
  },
];

export const popularPaths = [PageType.MODIFY_HEADER];

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
