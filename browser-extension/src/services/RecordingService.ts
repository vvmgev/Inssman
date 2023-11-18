import BaseService from "./BaseService";
import InjectCodeService from "./InjectCodeService";
import TabService from "./TabService";
import StorageService from "./StorageService";
import { InjectFileTagName } from "models/formFieldModel";
import { PostMessageAction } from "src/models/postMessageActionModel";
import { ListenerType } from "./ListenerService/ListenerService";
// import code from './contentCode';


function createRecorderWidget() {
  const newElement = document.createElement('button');
  newElement.textContent = 'Button';
  newElement.style.cssText = `
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  `;
  newElement.addEventListener('click', () => {
    alert('Button clicked!');
    window.postMessage({action: "stopRecording", from: 'content'}, window.origin);
  });
  document.documentElement.appendChild(newElement);
}

import Tab = chrome.tabs.Tab;
import { NAMESPACE } from "src/options/constant";

class RecordingService extends BaseService {
  private currentTab: Tab | null = null;
  private recordedEvents: Array<unknown> = [];
  private isRecording: boolean = false;

  onUpdateTab = async (tabId: number, _: unknown, tab: Tab): Promise<void> => {
    console.log('tabId', tabId);
    console.log('this.currentTab?.i', this.currentTab?.id);
    console.log('tab.status', tab.status);
    if(tabId === this.currentTab?.id && tab.status === 'complete' && false) {
      this.isRecording = true;
      InjectCodeService.injectExternalScript(tabId, chrome.runtime.getURL('recordSession/recordSession.js'));
      InjectCodeService.injectInternalScriptToDocument(tabId, `(${createRecorderWidget.toString()})();`);
      // InjectCodeService.injectInternalScriptToDocument(tabId, `window.INSSMAN.connect('${chrome.runtime.id}')`);
      InjectCodeService.injectInternalScriptToDocument(tabId, `
        window.${NAMESPACE} = window.${NAMESPACE} || {}
        window.${NAMESPACE}.runtimeId = '${chrome.runtime.id}'
        window.postMessage({action: "startRecording", from: 'content'}, window.origin);
      `);
    }
  }

  async startRecording(url: string): Promise<void> {
    // this.addListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
    this.currentTab = await TabService.createTab(url);
    setTimeout(() => {
      console.log('setTimeout');
      InjectCodeService.injectExternalScript(this.currentTab?.id, chrome.runtime.getURL('recordSession/recordSession.js'));
      console.log('setTimeout');
    }, 3000)

    // chrome.tabs.onRemoved.addListener((tabId, info) => {
    //     if(tabId === this.currentTab?.id) {
    //       console.log('info', info);
    //     }
    // });
  }

  async stopRecording(): Promise<void> {
    this.currentTab = null;
    this.recordedEvents = [];
    this.removeListener(ListenerType.ON_UPDATE_TAB, this.onUpdateTab);
    this.isRecording = false;
  }

  async saveRecording(data): Promise<void> {
    this.recordedEvents = data;
    await StorageService.set({recordedSession:  this.recordedEvents});
  }
}

export default new RecordingService();
