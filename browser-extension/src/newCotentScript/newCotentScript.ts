import { NAMESPACE } from 'options/constant';

window[NAMESPACE] = window[NAMESPACE] || {};
let RecordSession;
let isRecording = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>  {
  console.log('request', request);
  console.log('request', request.data);
  // window.postMessage({type: 'startRecording'}, window.origin);
  sendResponse();
});

window.addEventListener('message', (event) => {
  if (event.origin !== window.origin) return;
  console.log('addEventListener.event', event);
  console.log('addEventListener.event.data', event.data);
  switch (event.data.type) {
    case 'startRecording':
      if(isRecording) return;
      RecordSession = new window[NAMESPACE].recordSession();
      RecordSession.start();
      isRecording = true;
    break;
    case 'stopRecording':
      RecordSession.stop();
      isRecording = false;
    break;
  }

  console.log('Received message:', event.data);
});

