import BaseService from "./BaseService";
import InjectCodeService from "./InjectCodeService";
import TabService from "./TabService";
import StorageService from "./StorageService";
import { ListenerType } from "./ListenerService/ListenerService";
import { StorageItemType } from "src/models/storageModel";

import Tab = chrome.tabs.Tab;

class RecordSessionService extends BaseService {
  private currentTab: Tab | null = null;
  private url: string = '';
  // @ts-ignore
  private sessionId: string;

  onUpdateTab = (tabId: number): void => {
    if(tabId === this.currentTab?.id) {
      InjectCodeService.injectInternalScriptToDocument(tabId, `window.postMessage({source: 'inssman:serviceWorker', action: 'showWidget'})`);
      InjectCodeService.injectInternalScriptToDocument(tabId, `window.postMessage({source: 'inssman:serviceWorker', action: 'startRecording'})`);
    }
  }

  async startRecording(url: string): Promise<void> {
    this.url = url;
    this.addListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
    this.currentTab = await TabService.createTab(url);
    this.sessionId = String(await StorageService.generateNextId());
  }

  stopRecording(): void {
    this.currentTab = null;
    this.removeListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
  }

  async saveRecording(data: unknown[]): Promise<void> {
    const events = await StorageService.getSingleItem(this.sessionId) || [];
    await StorageService.set({[this.sessionId]:  {
      id: this.sessionId,
      events: [...events, ...data],
      type: StorageItemType.RECORDED_SESSION,
      url: this.url
    }});
  }
}

export default new RecordSessionService();
