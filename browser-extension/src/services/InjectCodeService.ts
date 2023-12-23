import StorageService from "./StorageService";
import MatcherService from "./MatcherService";
import BaseService from "./BaseService";
import {
  PageType,
  InjectFileTagMap,
  InjectFileType,
  InjectFileTypeMap,
  InjectFileSource,
  IRuleMetaData,
} from "src/models/formFieldModel";
import { ListenerType } from "./ListenerService/ListenerService";
import { NAMESPACE } from "src/options/constant";
import ExecutionWorld = chrome.scripting.ExecutionWorld;
import InjectionResult = chrome.scripting.InjectionResult;

class InjectCodeService extends BaseService {
  rulesData: IRuleMetaData[] = [];
  isRegisteredListener: boolean = false;

  constructor() {
    super();
    this.init();
    // without removeListener
    // temp should add removeListener
    this.addListener(ListenerType.ON_CHANGE_STORAGE, this.onChangeStorage);
  }

  init = async () => {
    this.rulesData = await this.getInjectFileRules();
    if (this.rulesData.length) {
      this.isRegisteredListener = true;
      this.addListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
    }
  };

  onChangeNavigation = (transation): void => {
    this.rulesData.forEach((ruleMetaData: IRuleMetaData) => {
      if (ruleMetaData.pageType === PageType.INJECT_FILE) {
        if (MatcherService.isUrlsMatch(ruleMetaData.source, transation.url, ruleMetaData.matchType)) {
          if (InjectFileTagMap[ruleMetaData.editorLang as string] === InjectFileTagMap[InjectFileType.HTML]) {
            this.injectHTML(
              transation.tabId,
              ruleMetaData.editorValue,
              ruleMetaData.tagSelector,
              ruleMetaData.tagSelectorOperator
            );
            StorageService.updateTimestamp(String(ruleMetaData.id));
            return;
          }
          if (ruleMetaData.fileSourceType === InjectFileSource.URL) {
            if (InjectFileTagMap[ruleMetaData.editorLang as string] === InjectFileTagMap[InjectFileType.JAVASCRIPT]) {
              this.injectExternalScript(transation.tabId, ruleMetaData.fileSource);
            } else {
              this.injectExternalStyle(transation.tabId, ruleMetaData.fileSource);
            }
          } else {
            this.injectInternalScript(
              transation.tabId,
              ruleMetaData.editorValue,
              InjectFileTagMap[ruleMetaData.editorLang as string]
            );
          }
          StorageService.updateTimestamp(String(ruleMetaData.id));
        }
      }
    });
  };

  onChangeStorage = (changes) => {
    const changesArr: any = Object.values(changes);
    // check why changes argument is array
    changesArr.forEach(async ({ newValue, oldValue }) => {
      if (newValue?.pageType === PageType.INJECT_FILE || oldValue?.pageType === PageType.INJECT_FILE) {
        this.rulesData = await this.getInjectFileRules();
        if (this.isRegisteredListener && !this.rulesData.length) {
          this.isRegisteredListener = false;
          this.removeListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
        }
        if (!this.isRegisteredListener && this.rulesData.length) {
          this.isRegisteredListener = true;
          this.addListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
        }
      }
    });
  };

  async getInjectFileRules(): Promise<IRuleMetaData[]> {
    const filters = [
      { key: "pageType", value: PageType.INJECT_FILE },
      { key: "enabled", value: true },
    ];
    return await StorageService.getFilteredRules(filters);
  }

  injectHTML(tabId, code, selector, operator) {
    const replacedCode = code.replaceAll("'", "\\'");
    chrome.scripting.executeScript({
      target: { tabId },
      // this code runs in the browser tab
      func: (code, selector, operator) => {
        const element = document.createElement("script");
        element.textContent = `(() => {
          const element = ${selector || "document.body"};
          if('${operator}' === 'innerhtml') {
            element.innerHTML = '${code}';
            return;
          }
          element.insertAdjacentHTML('${operator}', '${code}');
        })();`;
        element.className = `inssman_html`;
        document.head.appendChild(element);
      },
      args: [replacedCode, selector, operator],
      world: "MAIN",
      //@ts-ignore
      injectImmediately: true,
    });
  }

  injectExternalScript(tabId, url, shouldRemove = false): void {
    chrome.scripting.executeScript({
      target: { tabId },
      // this code runs in the browser tab
      func: (url, shouldRemove) => {
        try {
          const element = document.createElement("script");
          element.type = "text/javascript";
          element.className = "inssman_script";
          element.src = url;
          document.head.appendChild(element);

          if (shouldRemove) {
            element.remove();
          }
        } catch (error) {
          console.log("error");
          console.log(error);
        }
      },
      args: [url, shouldRemove],
      world: "MAIN",
      //@ts-ignore
      injectImmediately: true,
    });
  }

  injectExternalStyle(tabId, url, shouldRemove = false): void {
    chrome.scripting.executeScript({
      target: { tabId },
      // this code runs in the browser tab
      func: (url, shouldRemove) => {
        const element = document.createElement("link");
        element.type = "type/css";
        element.className = "inssman_style";
        element.href = url;
        document.head.appendChild(element);

        if (shouldRemove) {
          element.remove();
        }
      },
      args: [url, shouldRemove],
      world: "MAIN",
      //@ts-ignore
      injectImmediately: true,
    });
  }

  injectInternalScript(tabId, code, tag, shouldRemove = false, world = "MAIN" as ExecutionWorld): void {
    chrome.scripting.executeScript({
      target: { tabId },
      // this code runs in the browser tab
      func: (code, tag, type, shouldRemove) => {
        const element = document.createElement(tag);
        element.textContent = code;
        element.type = type || "";
        element.className = `inssman_${tag}`;
        document.head.appendChild(element);

        if (shouldRemove) {
          element.remove();
        }
      },
      args: [code, tag, InjectFileTypeMap[tag], shouldRemove],
      world,
      //@ts-ignore
      injectImmediately: true,
    });
  }

  async injectInternalScriptToDocument(
    tabId,
    code,
    shouldRemove = false,
    world = "MAIN" as ExecutionWorld
  ): Promise<InjectionResult[]> {
    return chrome.scripting.executeScript({
      target: { tabId },
      // this code runs in the browser tab
      func: (code, tag, type, shouldRemove) => {
        const element = document.createElement(tag);
        element.textContent = code;
        element.type = type || "";
        element.className = `inssman_${tag}`;
        document.documentElement.appendChild(element);

        if (shouldRemove) {
          element.remove();
        }
      },
      args: [code, "script", "text/javascript", shouldRemove],
      world,
      //@ts-ignore
      injectImmediately: true,
    });
  }

  injectFile = async (tabId, path) => {
    chrome.scripting
      .executeScript({
        target: { tabId },
        files: [path],
        world: "MAIN",
        // @ts-ignore
        injectImmediately: true,
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
        // should be tracking here
      });
  };

  injectContentScript = async (tabId, rules) => {
    chrome.scripting
      .executeScript({
        target: { tabId },
        // this code runs in the browser tab
        func: (rules: IRuleMetaData[], NAMESPACE: string, runtimeId: string) => {
          window[NAMESPACE].rules = rules;
          window[NAMESPACE].runtimeId = runtimeId;
          window[NAMESPACE].start();
        },
        world: "MAIN",
        args: [rules, NAMESPACE, chrome.runtime.id],
        // @ts-ignore
        injectImmediately: true,
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
        // should be tracking here
      });
  };
}

export default new InjectCodeService();
