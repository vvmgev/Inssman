import { record } from "rrweb";
import { htmlToImage } from "@/utils/htmlToImage";

const MAX_DURATION = 5 * 60 * 1000;
let recordSession;
let isRecording = false;

class RecordSession {
  preview;
  stopRecording;
  events: any[] = [];

  constructor() {
    window.addEventListener("beforeunload", () => {
      this.sendEvent();
    });
  }

  takeScreenshot() {
    htmlToImage(document.body).then((preview) => {
      this.preview = preview;
    });
  }

  start() {
    this.stopRecording = record({
      // @ts-ignore
      recordAfter: "DOMContentLoaded",
      recordCrossOriginIframes: true,
      blockClass: "inssman-ignore-element",
      emit: (event) => {
        const timeDiff = this.events[this.events.length - 1]?.timestamp - this.events[0]?.timestamp;
        if (!this.events.length || timeDiff <= MAX_DURATION) {
          this.events.push(event);
        }
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
    window.postMessage({
      source: "inssman:recordSession",
      action: "saveRecordedSession",
      data: { events: copyEvents, preview: this.preview },
    });
  }

  stop() {
    this.stopRecording();
    this.sendEvent();
    window.postMessage({
      source: "inssman:recordSession",
      action: "stopRecordedSession",
    });
  }
}

window.addEventListener("message", (event) => {
  const { action, source, data } = event.data;
  if (event.origin !== window.origin || !source?.startsWith?.("inssman:") || source.startsWith("inssman:recordSession"))
    return;
  switch (action) {
    case "startRecording":
      if (isRecording) return;
      recordSession = new RecordSession();
      isRecording = true;
      recordSession.start();
      setTimeout(() => {
        recordSession.takeScreenshot();
      }, 1500);
      break;
    case "stopRecording":
      isRecording = false;
      recordSession.stop();
      break;
  }
});
