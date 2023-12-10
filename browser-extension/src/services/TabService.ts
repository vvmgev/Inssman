import Tab = chrome.tabs.Tab;

class TabService {

  async createTab(url: string): Promise<Tab> {
    return await chrome.tabs.create({ url });
  }

}

export default new TabService();
