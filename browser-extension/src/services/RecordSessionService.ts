import BaseService from "@services/BaseService";
import InjectCodeService from "@services/InjectCodeService";
import TabService from "@services/TabService";
import IndexDBService from "@services/IndexDBService";
import handleError from "@/serviceWorker/errorHandler";
import { ListenerType } from "@services/ListenerService/ListenerService";
import { extractDomain } from "@utils/extractDomain";
import { RecordSession } from "@models/recordSessionModel";
import { PostMessageAction } from "@/models/postMessageActionModel";
import { getRecordedSessionByID, storeRecordedSession } from "@/serviceWorker/firebase";

import Tab = chrome.tabs.Tab;

class RecordSessionService extends BaseService {
  private currentTab: Tab | null = null;
  private url: string = "";
  private sessionId: number | null;
  private listenersMap: Partial<Record<PostMessageAction, any>>;

  constructor() {
    super();
    this.addListener(ListenerType.ON_MESSAGE, this.onMessage);
    this.listenersMap = {
      [PostMessageAction.StartRecordingByUrl]: this.startRecordingByUrl,
      [PostMessageAction.StartRecordingByCurrentTab]: this.startRecordingByCurrentTab,
      [PostMessageAction.SaveRecording]: this.saveRecording,
      [PostMessageAction.UpdateRecordedSession]: this.updateRecordedSession,
      [PostMessageAction.StopRecording]: this.stopRecording,
      [PostMessageAction.GetRecordedSessions]: this.getRecordedSessions,
      [PostMessageAction.GetRecordedSessionById]: this.getSessionById,
      [PostMessageAction.GetLastRecordedSession]: this.getLastRecordedSession,
      [PostMessageAction.DeleteRecordedSessionById]: this.removeById,
      [PostMessageAction.DeleteRecordedSessions]: this.clear,
      [PostMessageAction.ShareRecordedSession]: this.shareRecordedSession,
      [PostMessageAction.GetSharedRecordedSession]: this.getSharedRecordedSession,
    };
  }

  onMessage = async (request, sender, sendResponse) => {
    const handler = this.listenersMap[request.action];
    if (handler) {
      try {
        sendResponse(await handler(request.data));
      } catch (error) {
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

  startRecordingByUrl = async ({ url }: { url: string }): Promise<void> => {
    this.sessionId = null;
    this.url = url;
    this.addListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
    this.addListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
    this.currentTab = await TabService.createTab(url);
  };

  startRecordingByCurrentTab = async (): Promise<void> => {
    this.sessionId = null;
    this.currentTab = await TabService.getCurrentTab();
    if (this.currentTab) {
      this.addListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
      this.addListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
      this.url = this.currentTab.url as string;
      this.injectCodes(this.currentTab.id as number);
    }
  };

  stopRecording = async (): Promise<void> => {
    this.currentTab = null;
    this.removeListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
    this.removeListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
    const lastRecordedSession = await this.getLastRecordedSession();
    if (lastRecordedSession.id) {
      const url = chrome.runtime.getURL(`options/options.html#/record/session/${lastRecordedSession.id}`);
      TabService.createTab(url);
    }
  };

  saveRecording = async ({ events }: { events: any }): Promise<void> => {
    const session: any = {
      events,
      url: this.url,
      date: new Date().toLocaleString(),
      name: extractDomain(this.url),
    };
    if (this.sessionId) {
      const prevSession = await this.getSessionById({ id: this.sessionId });
      session.id = this.sessionId;
      session.events = [...prevSession.events, ...session.events];
      await IndexDBService.put(session);
    } else {
      this.sessionId = await IndexDBService.add(session);
    }
  };

  updateRecordedSession = async (data: any): Promise<void> => {
    return IndexDBService.put(data);
  };

  getRecordedSessions = async (): Promise<RecordSession[]> => {
    return IndexDBService.getAll();
  };

  getSessionById = async ({ id }: { id: number }): Promise<RecordSession> => {
    return IndexDBService.get(id);
  };

  clear = (): void => {
    IndexDBService.clear();
  };

  removeById = ({ id }: { id: number }) => {
    IndexDBService.remove(id);
  };

  getLastRecordedSession = () => {
    return IndexDBService.getLastItem();
  };

  shareRecordedSession = async ({ session }) => {
    return storeRecordedSession(session);
  };

  getSharedRecordedSession = async ({ id }) => {
    return getRecordedSessionByID(id);
  };
}

export default new RecordSessionService();
