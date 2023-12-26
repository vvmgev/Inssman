import Tab = chrome.tabs.Tab;

class TabService {
  async createTab(url: string): Promise<Tab> {
    return await chrome.tabs.create({ url });
  }

  async getCurrentTab(): Promise<Tab> {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
}

export default new TabService();
