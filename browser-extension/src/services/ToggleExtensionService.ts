import BaseService from "@services/BaseService";
import StorageService from "@services/StorageService";
import handleError from "@/serviceWorker/errorHandler";
import { PostMessageAction } from "@/models/postMessageActionModel";
import { ListenerType } from "@services/ListenerService/ListenerService";
import { StorageKey } from "@models/storageModel";

import MessageSender = chrome.runtime.MessageSender;

class ToggleExntesion extends BaseService {
  private listenersMap: Partial<Record<PostMessageAction, any>>;

  constructor() {
    super();
    this.addListener(ListenerType.ON_MESSAGE, this.onMessage);
    this.listenersMap = {
      [PostMessageAction.ToggleExntesion]: this.toggleExtension,
    };
  }

  onMessage = async (request, sender, sendResponse) => {
    const handler = this.listenersMap[request.action];
    if (handler) {
      try {
        sendResponse(await handler(request.data));
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

  toggleExtensionOptions = async ({ checked }: { checked: boolean }): Promise<void> => {
    const tabs = await chrome.tabs.query({
      url: ["https://*.inssman.com/*", chrome.runtime.getURL("options/options.html")],
    });
    if (tabs.length) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id as number, {
          action: PostMessageAction.ToggleExntesionOptions,
          data: { checked },
        });
      });
    }
  };

  toggleExtension = async ({ checked }: { checked: boolean }, sender: MessageSender): Promise<void> => {
    await this.toggleExtensionOptions({ checked });
    await StorageService.set({ [StorageKey.EXTENSION_STATUS]: checked });
    // TODO: below codo not working: investigate

    // chrome.runtime.sendMessage(
    //   chrome.runtime.id,
    //   {
    //     action: PostMessageAction.ToggleRules,
    //     data: { checked },
    //   },
    //   (data) => {
    //     console.log(data);
    //   }
    // );
  };
}

export default new ToggleExntesion();
