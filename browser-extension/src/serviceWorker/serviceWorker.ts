import StorageService from "@services/StorageService";
import BSService from "@services/BrowserSupportService";
import InjectCodeService from "@services/InjectCodeService";
import BaseService from "@services/BaseService";
import handleError from "./errorHandler";
import { ListenerType } from "@services/ListenerService/ListenerService";
import { PostMessageAction } from "@models/postMessageActionModel";
import { IRuleMetaData, PageType } from "@models/formFieldModel";
import { StorageKey } from "@models/storageModel";
import { UNINSTALL_URL, EXCLUDED_URLS } from "@options/constant";
import storgeDataConverter from "./storgeDataConverter";
import "@services/RegisterService";

class ServiceWorker extends BaseService {
  private listenersMap: Partial<Record<PostMessageAction, any>>;

  constructor() {
    super();
    chrome.runtime.setUninstallURL(UNINSTALL_URL);

    this.addListener(ListenerType.ON_INSTALL, this.onInstalled)
      .addListener(ListenerType.ON_MESSAGE, this.onMessage)
      .addListener(ListenerType.ON_UPDATE_TAB, this.onUpdatedTab);

    this.listenersMap = {
      [PostMessageAction.GetUserId]: this.getUserId,
      [PostMessageAction.GetExtensionStatus]: this.getExtensionStatus,
      [PostMessageAction.URLChanged]: this.URLChanged,
    };
  }

  onMessage = async (request, sender, sendResponse) => {
    const handler = this.listenersMap[request.action];
    if (handler) {
      try {
        sendResponse(await handler(request.data, sender));
      } catch (error: any) {
        const { version } = chrome.runtime.getManifest();
        sendResponse({
          error: true,
          info: handleError(error, {
            action: PostMessageAction[request.action],
            data: { ...(request.data || {}), version },
          }),
        });
      }
    }
  };

  onInstalled = () => {
    storgeDataConverter();
  };

  onUpdatedTab = (tabId, changeInfo, tab): void => {
    this.injectContentScript(tabId, changeInfo, tab);
  };

  injectContentScript = async (tabId, _, tab) => {
    const isUrlExluded: boolean = EXCLUDED_URLS.some((url) => tab.url?.startsWith(url));
    const filters = [
      { key: "pageType", value: PageType.MODIFY_REQUEST_BODY },
      { key: "enabled", value: true },
    ];
    const rules: IRuleMetaData[] = await StorageService.getFilteredRules(filters);
    if (!BSService.isSupportScripting() || isUrlExluded || !rules.length) return;
    InjectCodeService.injectContentScript(tabId, rules);
  };

  async getUserId(): Promise<{ [key: string]: number }> {
    return { [StorageKey.USER_ID]: await StorageService.getUserId() };
  }

  async getExtensionStatus(): Promise<boolean> {
    const status: boolean = await StorageService.getSingleItem(StorageKey.EXTENSION_STATUS);
    return typeof status === "undefined" ? !status : status;
  }

  async URLChanged({ pathname }: { pathname: string }, sender): Promise<void> {
    InjectCodeService.injectInternalScriptToDocument(
      sender.tab.id,
      `window.postMessage({source: 'inssman:setup', action: 'URLChanged', data: {'pathname': '${pathname}'}})`
    );
  }
}

new ServiceWorker();
