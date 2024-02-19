import { StorageItemType, StorageKey } from "@models/storageModel";
import { IRuleMetaData } from "@models/formFieldModel";
const asa = {
  "32": {
    destination: "Redirect.com",
    enabled: true,
    id: 32,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "asdsad",
    pageType: "redirect",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "Redirect.com",
    type: "rule",
  },
  "33": {
    enabled: true,
    id: 33,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Block-1708343567317",
    pageType: "block",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "block.com",
    type: "rule",
  },
  "34": {
    enabled: true,
    id: 34,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Query Param-1708343611813",
    pageType: "query-param",
    queryParams: [
      {
        action: "add",
        key: "AddKey",
        value: "AddValue",
      },
      {
        action: "replace",
        key: "ReplaceKey",
        value: "ReplaceValue",
      },
      {
        action: "remove",
        key: "RemoveKey",
        value: "",
      },
    ],
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "quertyParam.com",
    type: "rule",
  },
  "35": {
    enabled: true,
    headers: [
      {
        header: "RequestSetKey",
        operation: "set",
        type: "request",
        value: "RequestSetValue",
      },
      {
        header: "RequestRemovKey",
        operation: "remove",
        type: "request",
        value: "",
      },
      {
        header: "RepsonseSetKey",
        operation: "set",
        type: "response",
        value: "RepsonseSetValue",
      },
      {
        header: "RepsonseAppendKey",
        operation: "append",
        type: "response",
        value: "RepsonseAppendValue",
      },
      {
        header: "RepsonseRemoveKey",
        operation: "remove",
        type: "response",
        value: "",
      },
    ],
    id: 35,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Modify Header-1708343645005",
    pageType: "modify-header",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "modifyheader.com",
    type: "rule",
  },
  "36": {
    editorLang: "html",
    editorValue: "<h1>asds</h1>",
    enabled: true,
    id: 36,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Modify Response-1708343718642",
    pageType: "modify-response",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "ModifyHeaderHTML.com",
    type: "rule",
  },
  "37": {
    editorLang: "css",
    editorValue: "body {\n    color: red\n}",
    enabled: true,
    id: 37,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Modify Response-1708343751277",
    pageType: "modify-response",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "ModifyHeaderCSS.com",
    type: "rule",
  },
  "38": {
    editorLang: "javascript",
    editorValue: 'alert("asds")',
    enabled: true,
    id: 38,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Modify Response-1708343777213",
    pageType: "modify-response",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "ModifyHeaderJS.com",
    type: "rule",
  },
  "39": {
    editorLang: "json",
    editorValue: '{\n    "json": 123\n}',
    enabled: true,
    id: 39,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Modify Response-1708343795668",
    pageType: "modify-response",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "ModifyHeaderJSON.com",
    type: "rule",
  },
  "40": {
    editorLang: "javascript",
    editorValue: "alert('asdasd')",
    enabled: true,
    fileSource: "",
    fileSourceType: "code",
    id: 40,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Inject File-1708343831759",
    pageType: "inject-file",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "InjectFileJSCODE.com",
    tagSelector: "",
    tagSelectorOperator: "afterbegin",
    type: "rule",
  },
  "41": {
    editorLang: "javascript",
    editorValue: "",
    enabled: true,
    fileSource: "url",
    fileSourceType: "url",
    id: 41,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Inject File-1708343841383",
    pageType: "inject-file",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "InjectFileJSURL.com",
    tagSelector: "",
    tagSelectorOperator: "afterbegin",
    type: "rule",
  },
  "42": {
    editorLang: "css",
    editorValue: "",
    enabled: true,
    fileSource: "somepath.com",
    fileSourceType: "url",
    id: 42,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Inject File-1708343853479",
    pageType: "inject-file",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "InjectFileCCURL.com",
    tagSelector: "",
    tagSelectorOperator: "afterbegin",
    type: "rule",
  },
  "43": {
    editorValue: '{\n    "test": 123\n}',
    enabled: true,
    id: 43,
    lastMatchedTimestamp: null,
    matchType: "contain",
    name: "Modify Request Body-1708343898084",
    pageType: "modify-request-body",
    requestMethods: [],
    resourceTypes: [],
    showFields: false,
    source: "modifyRequestBody.com",
    type: "rule",
  },
  nextId: 43,
};
class StorageService {
  constructor() {
    // this.clear();
    chrome.storage.local.get().then((data) => {
      console.log("storgae", data);
    });
    // this.set(asa);
  }
  async get(keys?: string | string[] | { [key: string]: any } | null): Promise<{ [key: string]: any }> {
    const data = await chrome.storage.local.get(keys);
    return data;
  }

  async getRules(): Promise<IRuleMetaData[]> {
    return Object.values(await this.get()).filter(
      (rule) => typeof rule === "object" && rule.type === StorageItemType.RULE
    );
  }

  async getFilteredRules(filters: { [key: string]: any }[]): Promise<IRuleMetaData[]> {
    const rules = await this.getRules();
    return rules.filter((rule) => filters.every((filter) => rule[filter.key] === filter.value));
  }

  async getSingleItem(key: string): Promise<any> {
    return (await this.get(key))[key];
  }

  async set(data: { [key: string]: any }): Promise<void> {
    return chrome.storage.local.set(data);
  }

  async remove(key: string | string[]): Promise<void> {
    return chrome.storage.local.remove(key);
  }

  async clear(): Promise<void> {
    return chrome.storage.local.clear();
  }

  async getAll(): Promise<{ [key: string]: any }> {
    return this.get();
  }

  async generateNextId(): Promise<number> {
    const nextId: number = ((await this.getSingleItem(StorageKey.NEXT_ID)) || 1) + 1;
    this.set({ [StorageKey.NEXT_ID]: nextId });
    return nextId;
  }

  async updateRuleTimestamp(id: string, timestamp: number = Date.now()): Promise<void> {
    const storageRule = await this.getSingleItem(id);
    if (storageRule) {
      storageRule.lastMatchedTimestamp = timestamp;
      await this.set({ [id]: storageRule });
    }
  }

  async getUserId(): Promise<number> {
    const timestamp: number = Date.now();
    const userId: number = (await this.getSingleItem(StorageKey.USER_ID)) || timestamp;
    if (userId === timestamp) {
      this.set({ [StorageKey.USER_ID]: userId });
    }
    return userId;
  }
}

export default new StorageService();
