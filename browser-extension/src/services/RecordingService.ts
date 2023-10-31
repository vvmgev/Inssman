import BaseService from "./BaseService";
import Tab = chrome.tabs.Tab
import { ListenerType } from "./ListenerService/ListenerService";

class RecordingService extends BaseService{

  // need to create TabService and move
  async createTab(url: string): Promise<Tab> {
    return await chrome.tabs.create({ url });
  }
  onChangeNavigation = (url, transation): void => {

  }

  async startRecording(url): Promise<void> {
    this.addListener(ListenerType.ON_COMMITTED, (transation) => {
      this.onChangeNavigation(url, transation);
    });
    const tab = await this.createTab(url);

  }

}

export default new RecordingService();
