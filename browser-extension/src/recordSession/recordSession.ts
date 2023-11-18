import { record } from "rrweb";
import { PostMessageAction } from "src/models/postMessageActionModel";

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

    this.events = [];
    window.postMessage({source: 'inssman:recordSession', action: 'saveRecordSession', data: { events: copyEvents } })
    // try {
    //   chrome.runtime.sendMessage({
    //     action: PostMessageAction.SaveRecording,
    //     data: {events: copyEvents}
    //   });
    // } catch (error) {
    // }
  }

  stop() {
    console.log('inssman stop recordin');
    this.stopRecording();
    // this.sendEvent();
  }
}

alert();
console.log('recordSession')

let recordSession = new RecordSession();
window.addEventListener('message', event => {
  const { action, source, data } = event.data;
  if ((event.origin !== window.origin) || (!source?.startsWith?.('inssman:') || source.startsWith('inssman:recordSession'))) return;
  switch (event.data.action) {
    case 'startRecording':
      recordSession.start();
    break;
    case 'stopRecording':
      recordSession.stop()
    break;
  }

  console.log('Received message:', event.data);
});
