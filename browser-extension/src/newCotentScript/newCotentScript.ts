import { NAMESPACE } from 'options/constant';
import { PostMessageAction } from 'src/models/postMessageActionModel';

window[NAMESPACE] = window[NAMESPACE] || {};

let RecordSession;
let isRecording = false;
const events: unknown[] = [];
let port: any;

window[NAMESPACE].connect = (runtimeId) => {
  // console.log('inssman runtimeId', runtimeId);
  // port = chrome.runtime.connect(runtimeId);
  // console.log('inssman port', port);
  // port.onMessage.addListener('message', (...args) => {
  //   console.log('inssman args', args);
  // })
}

window.addEventListener('message', event => {
  if ((event.origin !== window.origin) || event.data.from !== 'content') return;
  console.log('inssman addEventListener.event', event);
  console.log('inssman addEventListener.event.data', event.data);
  switch (event.data.action) {
    case 'startRecording':
      if(isRecording) return;
      // RecordSession = new window[NAMESPACE].recordSession();
      // RecordSession.start();
      isRecording = true;
    break;
    case 'stopRecording':
      // RecordSession.stop();
      isRecording = false;
      console.log('inssman window[NAMESPACE]', window[NAMESPACE]);
      // chrome.runtime.sendMessage(window[NAMESPACE].runtimeId, {action: PostMessageAction.SaveRecording, data: {events: RecordSession.getSession()}});
    break;
  }
});
