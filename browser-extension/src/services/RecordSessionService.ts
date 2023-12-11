import BaseService from "./BaseService";
import InjectCodeService from "./InjectCodeService";
import TabService from "./TabService";
import StorageService from "./StorageService";
import indexDBService from "./indexDBService";
import { ListenerType } from "./ListenerService/ListenerService";
import { extractDomain } from "src/utils";
import { RecordSession } from "src/models/recordSessionModel";
import Tab = chrome.tabs.Tab;

class RecordSessionService extends BaseService {
  private currentTab: Tab | null = null;
  private url: string = '';
  // @ts-ignore
  private sessionId: string;

  injectCodes = (tabId: number) => {
    InjectCodeService.injectInternalScriptToDocument(tabId, `window.postMessage({source: 'inssman:setup', action: 'showWidget'})`);
    InjectCodeService.injectInternalScriptToDocument(tabId, `window.postMessage({source: 'inssman:setup', action: 'startRecording'})`);
  }

  onUpdateTab = (tabId: number): void => {
    if(tabId === this.currentTab?.id) {
      this.injectCodes(tabId);
    }
  }

  onRemovedTab = async (tabId: number): Promise<void> => {
    if(tabId === this.currentTab?.id) {
      this.removeListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
      this.removeListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
    }
  }

  async startRecordingByUrl(url: string): Promise<void> {
    this.url = url;
    this.addListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
    this.addListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
    this.currentTab = await TabService.createTab(url);
    this.sessionId = String(await StorageService.generateNextId());
  }

  stopRecording(): void {
    this.currentTab = null;
    this.removeListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
    this.removeListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
  }

  async saveRecording(data: any[]): Promise<void> {
    indexDBService.add({
      events: data,
      url: this.url,
      date: new Date().toLocaleString(),
      name: extractDomain(this.url),
    });
  }

  async getRecordedSessions(): Promise<RecordSession[]> {
    return indexDBService.getAll();
  }

  async getSessionById(id): Promise<RecordSession> {
    return indexDBService.get(id);
  }

  clear(): void {
    indexDBService.clear();
  }

  removeById(id) {
    indexDBService.remove(id);
  }

}

export default new RecordSessionService();
