import { record } from "rrweb";
import { PostMessageAction } from "src/models/postMessageActionModel";
import { NAMESPACE } from "src/options/constant";


console.log('RecordSession file');

class RecordSession {
  stopRecording;
  events: unknown[] = [];

  constructor() {
    console.log('constructor RecordSession');
  }

  start() {
    console.log('inssman start recordin');
    this.stopRecording = record({
      // @ts-ignore
      recordAfter: 'DOMContentLoaded',
      recordCrossOriginIframes: true,
      emit: (event) => {
        console.log('event', event);
        this.events.push(event);
        // this.sendEvent();
      },
    });
  }

  getSession() {
    const copyEvents = JSON.parse(JSON.stringify(this.events));
    this.events = [];
    return copyEvents;
  }


  sendEvent() {
    const copyEvents = JSON.parse(JSON.stringify(this.events));
    console.log('inssman sendEvent', copyEvents);

    this.events = []
    try {
      chrome.runtime.sendMessage({
        action: PostMessageAction.SaveRecording,
        data: {events: copyEvents}
      });
    } catch (error) {
    }
  }

  stop() {
    console.log('inssman stop recordin');
    this.stopRecording();
    // this.sendEvent();
  }


}

window[NAMESPACE] = window[NAMESPACE] || {};
window[NAMESPACE].recordSession = window[NAMESPACE].recordSession || RecordSession;
