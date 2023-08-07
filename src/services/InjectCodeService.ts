import { PageType, InjectFileTagMap, InjectFileType, InjectFileTypeMap, MatchType, InjectFileSource } from "src/models/formFieldModel";
import StorageService from "./StorageService";
import MatcherService from "./MatcherService";
import { IRuleData } from 'models/formFieldModel';
import { NAMESPACE } from "src/models/contants";
import BaseService from "./BaseService";
import { ListenerType } from "./ListenerService/ListenerService";

class InjectCodeService extends BaseService {
  rulesData: IRuleData[] = [];
  isRegisteredListener: boolean = false;

  constructor () {
    super();
    this.init();
    // without removeListener
    // temp should add removeListener
    this.addListener(ListenerType.ON_CHANGE_STORAGE, this.onChangeStorage);
  };

  init = async () => {
    this.rulesData = await this.getInjectFileRules();
    if(this.rulesData.length) {
      this.isRegisteredListener = true;
      this.addListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
    }
  };

  onChangeNavigation = (transation): void => {
    this.rulesData.forEach((ruleData: IRuleData) => {
      if(ruleData.pageType === PageType.INJECT_FILE) {
        if(MatcherService.isUrlsMatch(ruleData.source, transation.url, ruleData.matchType)) {
          if(InjectFileTagMap[ruleData.editorLang as string] === InjectFileTagMap[InjectFileType.HTML]) {
            this.injectHTML(transation.tabId, ruleData.editorValue, ruleData.tagSelector, ruleData.tagSelectorOperator);
            return;
          }
          if(ruleData.fileSourceType === InjectFileSource.URL) {
            if(InjectFileTagMap[ruleData.editorLang as string] === InjectFileTagMap[InjectFileType.JAVASCRIPT]){
              this.injectExternalScript(transation.tabId, ruleData.fileSource);
            } else {
              this.injectExternalStyle(transation.tabId, ruleData.fileSource);
            }
          } else {
            this.injectAndExecute(transation.tabId, ruleData.editorValue, InjectFileTagMap[ruleData.editorLang as string]);
          }
        }
      }
    })
  }

  onChangeStorage = changes => {
    const changesArr: any = Object.values(changes);
    // check why changes argument is array
    changesArr.forEach(async ({ newValue, oldValue }) => {
      if(newValue?.pageType === PageType.INJECT_FILE || oldValue?.pageType === PageType.INJECT_FILE) {
        this.rulesData = await this.getInjectFileRules();
        if(this.rulesData.length && !this.isRegisteredListener) {
          this.isRegisteredListener = true;
          this.addListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
        } else {
          this.isRegisteredListener = false;
          this.removeListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
        }
      }
    })
  }
  
  async getInjectFileRules(): Promise<IRuleData[]> {
    const filters = [{key: 'pageType', value: PageType.INJECT_FILE}, {key: 'enabled', value: true}];
    return await StorageService.getFilteredRules(filters);
  };

  injectHTML(tabId, code, selector, operator) {
    const replacedCode = code.replaceAll('\'', '\\\'');
    chrome.scripting.executeScript({
      target: {tabId},
      // this code runs in the browser tab
      func: (code, selector, operator) => {
        const element = document.createElement('script');
        element.textContent = `(() => {
          const element = ${selector};
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
      world: 'MAIN',
      //@ts-ignore
      injectImmediately: true,
    });
  }

  injectExternalScript(tabId, url, shouldRemove = false): void {
    chrome.scripting.executeScript({
      target: {tabId},
      // this code runs in the browser tab
      func: (url, shouldRemove) => {
        const element = document.createElement('script');
        element.type = 'text/javascript';
        element.className = 'inssman_script';
        element.src = url;
        document.head.appendChild(element);

        if(shouldRemove) {
          element.remove();
        }
      },
      args: [url, shouldRemove],
      world: 'MAIN',
      //@ts-ignore
      injectImmediately: true,
    });
  };

  injectExternalStyle(tabId, url, shouldRemove = false): void {
    chrome.scripting.executeScript({
      target: {tabId},
      // this code runs in the browser tab
      func: (url, shouldRemove) => {
        const element = document.createElement('link');
        element.type = 'type/css';
        element.className = 'inssman_style';
        element.href = url;
        document.head.appendChild(element);

        if(shouldRemove) {
          element.remove();
        }
      },
      args: [url, shouldRemove],
      world: 'MAIN',
      //@ts-ignore
      injectImmediately: true,
    });
  };

  injectAndExecute(tabId, code, tag, shouldRemove = false): void {
    chrome.scripting.executeScript({
      target: {tabId},
      // this code runs in the browser tab
      func: (code, tag, type, shouldRemove) => {
        const element = document.createElement(tag);
        element.textContent = code;
        element.type = type || '';
        element.className = `inssman_${tag}`;
        document.head.appendChild(element);

        if(shouldRemove) {
          element.remove();
        }
      },
      args: [code, tag, InjectFileTypeMap[tag], shouldRemove],
      world: 'MAIN',
      //@ts-ignore
      injectImmediately: true,
    });
  };
  
  injectContentScript = async (tabId, rules) => {
    chrome.scripting.executeScript({
      target : {tabId},
      func: (rules: IRuleData[], NAMESPACE: string) => {
        window[NAMESPACE].rules = rules.filter(rule => rule.enabled);
        window[NAMESPACE].start();
      },
      world: 'MAIN',
      args: [rules, NAMESPACE],
      // @ts-ignore
      injectImmediately: true,
    }).catch(() => {
      // should be tracking here
    });
  }
};

export default new InjectCodeService();
