import BaseService from "./BaseService";
import InjectCodeService from "./InjectCodeService";
import TabService from "./TabService";
import { InjectFileTagName } from "models/formFieldModel";
import { PostMessageAction } from "models/postMessageActionModel";
import { ListenerType } from "./ListenerService/ListenerService";

import Tab = chrome.tabs.Tab;
import WebNavigationTransitionCallbackDetails = chrome.webNavigation.WebNavigationTransitionCallbackDetails;
import StorageService from "./StorageService";

const code = `
(() => {
  if(window.startRecording) return;
  let intervalId;
  window.startRecording = true;
  console.log("started");
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.css';
  linkElement.type = 'text/css';
  document.head.appendChild(linkElement);
  const scriptElement = document.createElement('script');
  scriptElement.src = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js';
  scriptElement.type = 'text/javascript';
  scriptElement.crossOrigin = 'anonymous';
  scriptElement.onload = () => {
    console.log('onload');
    let events = [];
    window.eventssss = events;

    let stopFn = rrweb.record({
      emit(event) {
        events.push(event);
        if (events.length > 100) {
          // stop after 100 events
          stopFn();
          clearInterval(intervalId);
        }
      },
    });

    const save = () => {
      console.log('save');
      const body = JSON.stringify({ events });
      // events = [];
      try {
        chrome.runtime.sendMessage('${chrome.runtime.id}', {
          action: ${PostMessageAction.SaveRecording},
          data: {events}
        });
      } catch (error) {
        console.log('error', error);
      }
    }
    intervalId = setInterval(save, 3 * 1000);

  };
  document.head.appendChild(scriptElement);
  addEventListener('DOMContentLoaded', () => {
    const recordControl = document.createElement('div');
    recordControl.classList.add("inssman_recordControl");
    recordControl.style = "position: absolute; bottom: 20px; border: 1px solid red; width: 100px; height: 100px";
    recordControl.addEventListener('click', () => {
      clearInterval(intervalId);
      console.log('clear interval')
      try {
        chrome.runtime.sendMessage('${chrome.runtime.id}', {
          action: ${PostMessageAction.StopRecording},
        });
      } catch (error) {
        console.log('error', error);
      }
    });
    document.body.appendChild(recordControl);
    console.log("init")
  })
})();
`;

class RecordingService extends BaseService {
  private currentTab: Tab | null = null;
  private recordedEvents: Array<any> = [];

  onChangeNavigation = (transation: WebNavigationTransitionCallbackDetails): void => {
    console.log(this.currentTab?.id)
    if(transation.tabId === this.currentTab?.id) {
      InjectCodeService.injectAndExecute(this.currentTab.id, code, InjectFileTagName.JAVASCRIPT);
    }
  }

  async startRecording(url: string): Promise<void> {
    this.addListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
    this.currentTab = await TabService.createTab(url);
  }

  async stopRecording(): Promise<void> {
    console.log('stopRecording');
    console.log('this.recordedEvents', this.recordedEvents);
    this.currentTab = null;
    this.removeListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
    await StorageService.set({recordedSession:  this.recordedEvents});
    this.recordedEvents = [];
  }

  saveRecording(data): void {
    this.recordedEvents = [...this.recordedEvents, ...data];
  }
}

export default new RecordingService();
