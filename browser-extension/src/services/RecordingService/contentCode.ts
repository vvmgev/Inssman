import { PostMessageAction } from "src/models/postMessageActionModel";
import { record } from 'rrweb/dist/record/rrweb-record';

const scriptContent = record.toString();

export default `
(() => {
  if(window.startRecording) return;
  let intervalId;
  window.startRecording = true;
  console.log("started");
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.css';
  linkElement.type = 'text/css';
  // document.head.appendChild(linkElement);
  const scriptElement = document.createElement('script');
  // scriptElement.src = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js';
  scriptElement.type = 'text/javascript';
  scriptElement.crossOrigin = 'anonymous';
  scriptElement.textContent = ${scriptContent};

  document.head.appendChild(scriptElement);
  // scriptElement.onload = () => {
    console.log('onload');
    let events = [];
    // window.eventssss = events;

    let stopFn = record({
      emit(event) {
        events.push(event);
        if (events.length > 100) {
          // stop after 100 events
          stopFn();
          // events = [];
          clearInterval(intervalId);
        }
      },
    });

    const save = () => {
      console.log('save');
      const body = JSON.stringify(events);
      events = [];
      try {
        chrome.runtime.sendMessage('${chrome.runtime.id}', {
          action: ${PostMessageAction.SaveRecording},
          data: {events: JSON.parse(body)}
        });
      } catch (error) {
        console.log('error', error);
      }
    }
    intervalId = setInterval(save, 1 * 1000);

  // };
  addEventListener('DOMContentLoaded', () => {
    const recordControl = document.createElement('div');
    recordControl.classList.add("inssman_recordControl");
    recordControl.style = "position: fixed; bottom: 20px; border: 1px solid red; width: 100px; height: 100px";
    recordControl.addEventListener('click', () => {
      clearInterval(intervalId);
      console.log('clear interval')
      try {
        chrome.runtime.sendMessage('${chrome.runtime.id}', {
          action: ${PostMessageAction.StopRecording},
        });
      } catch (error) {
        console.log('error', error);
      }
    });
    document.body.appendChild(recordControl);
    console.log("init")
  })
})();
`;
