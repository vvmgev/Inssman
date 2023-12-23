import BaseService from "./BaseService";
import InjectCodeService from "./InjectCodeService";
import TabService from "./TabService";
import StorageService from "./StorageService";
import indexDBService from "./indexDBService";
import { ListenerType } from "./ListenerService/ListenerService";
import { extractDomain } from "@utils/extractDomain";
import { RecordSession } from "@models/recordSessionModel";

import Tab = chrome.tabs.Tab;

class RecordSessionService extends BaseService {
  private currentTab: Tab | null = null;
  private url: string = "";
  // @ts-ignore
  private sessionId: number | null;

  injectCodes = (tabId: number) => {
    InjectCodeService.injectInternalScriptToDocument(
      tabId,
      `window.postMessage({source: 'inssman:setup', action: 'showWidget'})`
    );
    InjectCodeService.injectInternalScriptToDocument(
      tabId,
      `window.postMessage({source: 'inssman:setup', action: 'startRecording'})`
    );
  };

  onUpdateTab = (tabId: number): void => {
    if (tabId === this.currentTab?.id) {
      this.injectCodes(tabId);
    }
  };

  onRemovedTab = async (tabId: number): Promise<void> => {
    if (tabId === this.currentTab?.id) {
      this.removeListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
      this.removeListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
    }
  };

  async startRecordingByUrl(url: string): Promise<void> {
    this.sessionId = null;
    this.url = url;
    this.addListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
    this.addListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
    this.currentTab = await TabService.createTab(url);
  }

  async startRecordingByCurrentTab(): Promise<void> {
    this.sessionId = null;
    this.currentTab = await TabService.getCurrentTab();
    if (this.currentTab) {
      this.addListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
      this.addListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
      this.url = this.currentTab.url as string;
      this.injectCodes(this.currentTab.id as number);
    }
  }

  stopRecording(): void {
    this.currentTab = null;
    this.removeListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
    this.removeListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
  }

  async saveRecording(data: any): Promise<void> {
    const session: any = {
      events: data,
      url: this.url,
      date: new Date().toLocaleString(),
      name: extractDomain(this.url),
    };
    if (this.sessionId) {
      const prevSession = await this.getSessionById(this.sessionId);
      session.id = this.sessionId;
      session.events = [...prevSession.events, ...session.events];
      await indexDBService.put(session);
    } else {
      this.sessionId = await indexDBService.add(session);
    }
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

  getLastRecordedSession() {
    return indexDBService.getLastItem();
  }
}

export default new RecordSessionService();
