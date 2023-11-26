import { record } from "rrweb";

let recordSession;
let isRecording = false;

class RecordSession {
  stopRecording;
  events: unknown[] = [];

  constructor() {
    window.addEventListener('beforeunload', () => {
      this.sendEvent();
    });
  }

  start() {
    console.log('inssman start recordin');
    this.stopRecording = record({
      // @ts-ignore
      recordAfter: 'DOMContentLoaded',
      recordCrossOriginIframes: true,
      emit: (event) => {
        this.events.push(event);
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
    this.events = [];
    window.postMessage({source: 'inssman:recordSession', action: 'saveRecordedSession', data: { events: copyEvents } })
  }

  stop() {
    console.log('inssman stop recordin');
    this.stopRecording();
    this.sendEvent();
  }
}

window.addEventListener('message', event => {
  const { action, source, data } = event.data;
  if ((event.origin !== window.origin) || (!source?.startsWith?.('inssman:') || source.startsWith('inssman:recordSession'))) return;
  switch (event.data.action) {
    case 'startRecording':
      if(isRecording) return;
      recordSession = new RecordSession();
      isRecording = true;
      recordSession.start();
    break;
    case 'stopRecording':
      isRecording = false;
      recordSession.stop()
    break;
  }
});
