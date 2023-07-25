import { PageType, InjectFileTagMap, InjectFileType, InjectFileTypeMap, MatchType, InjectFileSource } from "src/models/formFieldModel";
import StorageService from "./StorageService";
import { IRuleData } from 'models/formFieldModel';
import { replaceAsteriskToPlus } from "src/options/utils";

class InjectFileService {
  rulesData: IRuleData[] = [];

  constructor() {
    this.getEnabledRules();
    this.registerListener();
  };

  registerListener(): void {
    chrome.webNavigation.onCommitted.addListener(transation => {
      this.rulesData.forEach((ruleData: IRuleData) => {
        if(ruleData.pageType === PageType.INJECT_FILE) {
          if(this.isUrlMatch(ruleData.source, transation.url, ruleData.matchType)) {
                if(InjectFileTagMap[ruleData.editorLang as string] === InjectFileTagMap[InjectFileType.HTML]) {
                  this.createHTML(transation.tabId, ruleData.editorValue, ruleData.tagSelector, ruleData.tagSelectorOperator);
                  return;
                }
                if(ruleData.fileSourceType === InjectFileSource.URL) {
                  if(InjectFileTagMap[ruleData.editorLang as string] === InjectFileTagMap[InjectFileType.JAVASCRIPT]){
                    this.createExternalScript(transation.tabId, ruleData.fileSource);
                  } else {
                    this.createExternalStyle(transation.tabId, ruleData.fileSource);
                  }
                } else {
                  this.createAndExecute(transation.tabId, ruleData.editorValue, InjectFileTagMap[ruleData.editorLang as string]);
                }
          }
        }
      })
    });
    chrome.storage.onChanged.addListener(changes => {
      const changesArr = Object.values(changes);
      changesArr.forEach(({ newValue, oldValue }) => {
        if(newValue?.pageType === PageType.INJECT_FILE || oldValue?.pageType === PageType.INJECT_FILE) {
          this.getEnabledRules();
        }
      })
    });
  };
  
  isUrlMatch (source: string, transationUrl: string, matchType: string): boolean {
    return (matchType === MatchType.CONTAIN && transationUrl.includes(source)) || 
           (matchType === MatchType.EQUAL && transationUrl === source) ||
           (matchType === MatchType.WILDCARD && (new RegExp(replaceAsteriskToPlus(source))).test(transationUrl));
  };

  async getEnabledRules(): Promise<void> {
    this.rulesData = await StorageService.getEnabledRules();
  };

  createHTML(tabId, code, selector, operator) {
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

  createExternalScript(tabId, url, shouldRemove = false): void {
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

  createExternalStyle(tabId, url, shouldRemove = false): void {
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

  createAndExecute(tabId, code, tag, shouldRemove = false): void {
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
};

export default new InjectFileService();
