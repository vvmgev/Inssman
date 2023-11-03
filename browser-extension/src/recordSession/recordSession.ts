import { record } from "rrweb";
import { PostMessageAction } from "src/models/postMessageActionModel";

class RecordSession {
  stopRecording;
  runtimeId;

  constructor(runtimeId) {
    this.runtimeId = runtimeId;
  }

  start() {
    this.stopRecording = record({
      // @ts-ignore
      recordAfter: 'DOMContentLoaded',
      recordCrossOriginIframes: true,
      emit: (event) => {
        this.sendEvent(event);
      },
    });
  }


  sendEvent(event) {
    try {
      chrome.runtime.sendMessage(this.runtimeId, {
        action: PostMessageAction.UpdateTimestamp,
        data: {event}
      });
    } catch (error) {

    }
  }

  stop() {
    this.stopRecording();
  }


}

export default RecordSession;
