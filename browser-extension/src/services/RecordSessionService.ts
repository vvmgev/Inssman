import BaseService from "@services/BaseService";
import InjectCodeService from "@services/InjectCodeService";
import TabService from "@services/TabService";
import IndexDBService from "@services/IndexDBService";
import handleError from "@/serviceWorker/errorHandler";
import { ListenerType } from "@services/ListenerService/ListenerService";
import { extractDomain } from "@utils/extractDomain";
import { RecordSession } from "@models/recordSessionModel";
import { PostMessageAction } from "@/models/postMessageActionModel";
import {
  getRecordedSessionByID,
  getRecordedSessionByDocIDs,
  removeRecordedSession,
  storeRecordedSession,
} from "@/serviceWorker/firebase";
import { timeDifference } from "@/utils/timeDifference";

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
      [PostMessageAction.StartRecordingCurrentTab]: this.startRecordingCurrentTab,
      [PostMessageAction.SaveRecording]: this.saveRecording,
      [PostMessageAction.UpdateRecordedSession]: this.updateRecordedSession,
      [PostMessageAction.StopRecording]: this.stopRecording,
      [PostMessageAction.GetRecordedSessions]: this.getRecordedSessions,
      [PostMessageAction.GetRecordedSessionById]: this.getSessionById,
      [PostMessageAction.GetLastRecordedSession]: this.getLastRecordedSession,
      [PostMessageAction.DeleteRecordedSession]: this.removeById,
      [PostMessageAction.DeleteRecordedSessions]: this.clear,
      [PostMessageAction.ShareRecordedSession]: this.shareRecordedSession,
      [PostMessageAction.GetSharedRecordedSession]: this.getSharedRecordedSession,
      [PostMessageAction.GetSharedRecordedSessionByDocIDs]: this.getSharedRecordedSessionByDocIDs,
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

  onUpdateTab = (tabId: number): void => {
    if (tabId === this.currentTab?.id) {
      InjectCodeService.injectFile(tabId, "startRecording/startRecording.js");
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

  startRecordingCurrentTab = async (): Promise<void> => {
    this.sessionId = null;
    this.currentTab = await TabService.getCurrentTab();
    if (this.currentTab) {
      this.addListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
      this.addListener(ListenerType.ON_REMOVED_TAB, this.onRemovedTab);
      this.url = this.currentTab.url as string;
      InjectCodeService.injectFile(this.currentTab.id, "startRecording/startRecording.js");
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

  saveRecording = async ({ events, preview }: { events: any; preview: string }): Promise<void> => {
    const session: any = {
      events,
      url: this.url,
      date: new Date().toLocaleString(),
      name: extractDomain(this.url),
      preview,
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
    const recordedSessions = await IndexDBService.getAll();
    return recordedSessions.map(({ events, ...session }) => {
      const duration = timeDifference(events[0]?.timestamp || 0, events[events.length - 1]?.timestamp || 0);
      return {
        events: [],
        duration,
        ...session,
      };
    });
  };

  getSessionById = async ({ id }: { id: number }): Promise<RecordSession> => {
    return IndexDBService.get(id);
  };

  clear = async (): Promise<void> => {
    const sessions = await IndexDBService.getAll();
    sessions.forEach(({ docID }) => this.removeSharedSession(docID));
    IndexDBService.clear();
  };

  removeSharedSession = (id: string): void => {
    removeRecordedSession(id);
  };

  removeById = ({ session }: { session: RecordSession }) => {
    IndexDBService.remove(session.id);
    if (session.docID) {
      this.removeSharedSession(session.docID);
    }
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

  getSharedRecordedSessionByDocIDs = async ({ ids }: { ids: string[] }) => {
    return await getRecordedSessionByDocIDs(ids);
  };
}

export default new RecordSessionService();
