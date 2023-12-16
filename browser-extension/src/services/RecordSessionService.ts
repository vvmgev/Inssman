import BaseService from "./BaseService";
import InjectCodeService from "./InjectCodeService";
import TabService from "./TabService";
import IndexDBService from "./indexDBService";
import handleError from "src/serviceWorker/errorHandler";
import { ListenerType } from "./ListenerService/ListenerService";
import { extractDomain } from "src/utils";
import { RecordSession } from "models/recordSessionModel";
import { PostMessageAction } from "src/models/postMessageActionModel";

import Tab = chrome.tabs.Tab;

class RecordSessionService extends BaseService {
  private currentTab: Tab | null = null;
  private url: string = "";
  // @ts-ignore
  private sessionId: number | null;

  constructor() {
    super();
    this.addListener(ListenerType.ON_MESSAGE, this.onMessage);
  }

  private onMessage = (request, sender, sendResponse): void => {
    const { action, data } = request;
    (async () => {
      let responseData: any;
      try {
        if (action === PostMessageAction.StartRecordingByUrl) {
          responseData = this.startRecordingByUrl(data);
        } else if (action === PostMessageAction.StartRecordingByCurrentTab) {
          responseData = this.startRecordingByCurrentTab();
        } else if (action === PostMessageAction.StopRecording) {
          responseData = this.stopRecording();
        } else if (action === PostMessageAction.SaveRecording) {
          responseData = this.saveRecording(data);
        } else if (action === PostMessageAction.GetRecordedSessions) {
          responseData = this.getRecordedSessions();
        } else if (action === PostMessageAction.GetRecordedSessionById) {
          responseData = this.getSessionById(data);
        } else if (action === PostMessageAction.GetLastRecordedSession) {
          responseData = this.getLastRecordedSession();
        } else if (action === PostMessageAction.DeleteRecordedSessionById) {
          responseData = this.removeById(data);
        } else if (action === PostMessageAction.DeleteRecordedSessions) {
          responseData = this.clear();
        }
        if (responseData) {
          sendResponse(await responseData);
        }
      } catch (error: any) {
        const { version } = chrome.runtime.getManifest();
        sendResponse({
          error: true,
          info: handleError(error, {
            action: PostMessageAction[action],
            data: { ...(data || {}), version },
          }),
        });
      }
    })();
  };

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
      await IndexDBService.put(session);
    } else {
      this.sessionId = await IndexDBService.add(session);
    }
  }

  async getRecordedSessions(): Promise<RecordSession[]> {
    return IndexDBService.getAll();
  }

  async getSessionById(id): Promise<RecordSession> {
    return IndexDBService.get(id);
  }

  clear(): void {
    IndexDBService.clear();
  }

  removeById(id) {
    IndexDBService.remove(id);
  }

  getLastRecordedSession() {
    return IndexDBService.getLastItem();
  }
}

export default new RecordSessionService();
