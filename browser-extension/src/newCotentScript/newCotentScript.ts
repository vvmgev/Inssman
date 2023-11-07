import { NAMESPACE } from 'options/constant';

let RecordSession;
let isRecording = false;

window.addEventListener('message', event => {
  if ((event.origin !== window.origin) || event.data.from !== 'content') return;
  console.log('inssman addEventListener.event', event);
  console.log('inssman addEventListener.event.data', event.data);
  switch (event.data.action) {
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

window[NAMESPACE] = window[NAMESPACE] || {};
