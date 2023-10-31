import BaseService from "./BaseService";
import { ListenerType } from "./ListenerService/ListenerService";
import InjectCodeService from "./InjectCodeService";
import { InjectFileTagName } from "src/models/formFieldModel";
import Tab = chrome.tabs.Tab
import WebNavigationTransitionCallbackDetails = chrome.webNavigation.WebNavigationTransitionCallbackDetails
import { PostMessageAction } from "src/models/postMessageActionModel";

// const linkElement = document.createElement('link');
// linkElement.rel = 'stylesheet';
// linkElement.href = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.css';
// linkElement.type = 'text/css';
// document.body.appendChild(linkElement);
// const scriptElement = document.createElement('script');
// scriptElement.src = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js';
// scriptElement.type = 'text/javascript';
// scriptElement.crossOrigin = 'anonymous';
// scriptElement.onload = () => {
//   let events = [];
//   window.eventssss = events;

//   let stopFn = rrweb.record({
//     emit(event) {
//       events.push(event);
//       if (events.length > 100) {
//         // stop after 100 events
//         stopFn();
//         clearInterval(intervalId);
//       }
//     },
//   });


//   const save = () => {
//     console.log('save');
//     const body = JSON.stringify({ events });
//     events = [];
//     try {
//       chrome.runtime.sendMessage(${runtimeId}, {
//         action: PostMessageAction.UpdateTimestamp,
//         data: {events}
//       });
//     } catch (error) {}
//   }
//   const intervalId = setInterval(save, 5 * 1000);

// };
// document.body.appendChild(scriptElement);

// save events every 10 seconds


const code = `
  addEventListener("DOMContentLoaded", (event) => {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.css';
    linkElement.type = 'text/css';
    document.body.appendChild(linkElement);
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js';
    scriptElement.type = 'text/javascript';
    scriptElement.crossOrigin = 'anonymous';
    scriptElement.onload = () => {
      console.log('onload');
      let events = [];
      window.eventssss = events;

      let stopFn = rrweb.record({
        emit(event) {
          events.push(event);
          if (events.length > 100) {
            // stop after 100 events
            stopFn();
            clearInterval(intervalId);
          }
        },
      });

      const save = () => {
        console.log('save');
        const body = JSON.stringify({ events });
        // events = [];
        try {
          chrome.runtime.sendMessage('${chrome.runtime.id}', {
            action: ${PostMessageAction.SaveRecording},
            data: {events}
          });
        } catch (error) {
          console.log('error', error);
        }
      }
      const intervalId = setInterval(save, 5 * 1000);

    };
    document.body.appendChild(scriptElement);
  });
`;


class RecordingService extends BaseService {
  private currentTab: Tab | null = null;

  // need to create TabService and move
  async createTab(url: string): Promise<Tab> {
    return await chrome.tabs.create({ url });
  }

  onChangeNavigation = (transation: WebNavigationTransitionCallbackDetails): void => {
    if(transation.tabId === this.currentTab?.id) {
      InjectCodeService.injectAndExecute(this.currentTab.id, code, InjectFileTagName.JAVASCRIPT);
      this.removeListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
    }
  }

  async startRecording(url: string): Promise<void> {
    this.addListener(ListenerType.ON_COMMITTED, this.onChangeNavigation);
    this.currentTab = await this.createTab(url);
  }

  async stopRecording(): Promise<void> {
    this.currentTab = null
  }

}

export default new RecordingService();
