import BaseService from "../BaseService";
import InjectCodeService from "../InjectCodeService";
import TabService from "../TabService";
import StorageService from "../StorageService";
import { InjectFileTagName } from "models/formFieldModel";
import { ListenerType } from "../ListenerService/ListenerService";
// import code from './contentCode';

import Tab = chrome.tabs.Tab;
import WebNavigationTransitionCallbackDetails = chrome.webNavigation.WebNavigationTransitionCallbackDetails;

class RecordingService extends BaseService {
  private currentTab: Tab | null = null;
  private recordedEvents: Array<any> = [];

  onChangeNavigation = (transation: WebNavigationTransitionCallbackDetails): void => {
    if(transation.tabId === this.currentTab?.id) {
      InjectCodeService.injectInternalScript(this.currentTab.id, 'console.log("inssman"); window.startRecord()', InjectFileTagName.JAVASCRIPT);
    }
  }

  async startRecording(url: string): Promise<void> {
    this.addListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
    this.currentTab = await TabService.createTab(url);
  }

  async stopRecording(): Promise<void> {
    this.currentTab = null;
    this.removeListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
    await StorageService.set({recordedSession:  this.recordedEvents});
    this.recordedEvents = [];
  }

  saveRecording(data): void {
    console.log('saveRecording RecordingService', this.recordedEvents);
    this.recordedEvents = [...this.recordedEvents, ...data];
  }
}

export default new RecordingService();
