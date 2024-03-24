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

  async queryTabByUrl(url: string): Promise<Tab | undefined> {
    const tabs = await chrome.tabs.query({ url: [chrome.runtime.getURL("options/options.html")], currentWindow: true });
    return tabs?.find((tab) => tab.url?.includes(url));
  }

  async focusOrCreateTab(url: string): Promise<Tab> {
    const activeTab = await this.queryTabByUrl(url);
    // if tab already open then focus on it
    if (activeTab) {
      return await chrome.tabs.update(activeTab.id as number, { active: true });
    }
    // else open new tab
    return await chrome.tabs.create({ url });
  }
}

export default new TabService();
