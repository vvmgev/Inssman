import { record } from "rrweb";
import { PostMessageAction } from "src/models/postMessageActionModel";
import { NAMESPACE } from "src/options/constant";

window[NAMESPACE] = window[NAMESPACE] || {};

class RecordSession {
  stopRecording;
  events: any = [];

  constructor() {
    console.log('constructor RecordSession');
  }

  start() {
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


  sendEvent() {
    const copyEvents = JSON.parse(JSON.stringify(this.events));
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
    this.stopRecording();
    this.sendEvent();
  }


}

window[NAMESPACE] = window[NAMESPACE] || {};
window[NAMESPACE].recordSession = window[NAMESPACE].recordSession || RecordSession;
