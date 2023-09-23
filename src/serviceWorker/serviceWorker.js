import RuleService from 'services/RuleService';
import StorageService from 'services/StorageService';
import BSService from 'services/BrowserSupportService';
import InjectCodeService from 'services/InjectCodeService';
import BaseService from 'services/BaseService';
import MatcherService from 'services/MatcherService';
import config from 'options/formBuilder/config';
import { ListenerType } from 'services/ListenerService/ListenerService';
import { PostMessageAction } from 'models/postMessageActionModel';
import { PageType } from 'models/formFieldModel';
import { StorageKey } from 'models/storageModel';
import { UNINSTALL_URL, EXCLUDED_URLS } from 'options/constant';
import { throttle } from 'src/utils/throttle';
import handleError from './errorHandler';
import 'services/WebRequestService';

class ServiceWorker extends BaseService {
  throttleUpdateMatchedRulesTimestamp;

  constructor() {
    super();
    this.registerListener();
    const delay = chrome.declarativeNetRequest.GETMATCHEDRULES_QUOTA_INTERVAL * 60 * 1000 / chrome.declarativeNetRequest.MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL;
    this.throttleUpdateMatchedRulesTimestamp = throttle(this.updateMatchedRulesTimestamp, delay);
    chrome.runtime.setUninstallURL(UNINSTALL_URL);
  }

  async registerListener() {
    this.addListener(ListenerType.ON_INSTALL, this.onInstalled)
      .addListener(ListenerType.ON_MESSAGE, this.onMessage)
      .addListener(ListenerType.ON_MESSAGE_EXTERNAL, this.onMessage)
      .addListener(ListenerType.ON_UPDATE_TAB, this.onUpdatedTab);
  }

  onMessage = (request, _, sendResponse) => {
    const { action, data } = request;
    (async () => {
      let responseData;
      try {
        if (action === PostMessageAction.GetStorageRules) {
          responseData = this.getStorageRules();
        } else if (action === PostMessageAction.GetRule) {
          responseData = this.getRule(data);
        } else if (action === PostMessageAction.AddRule) {
          responseData = this.addRule(data);
        } else if (action === PostMessageAction.UpdateRule) {
          responseData = this.updateRule(data);
        } else if (action === PostMessageAction.DeleteRules) {
          responseData = this.deleteRules();
        } else if (action === PostMessageAction.DeleteRule) {
          responseData = this.deleteRule(data);
        } else if (action === PostMessageAction.GetUserId) {
          responseData = this.getUserId();
        } else if (action === PostMessageAction.ChangeRuleStatusById) {
          responseData = this.changeRuleStatusById(data);
        } else if (action === PostMessageAction.CopyRuleById) {
          responseData = this.copyRuleById(data);
        } else if (action === PostMessageAction.UpdateTimestamp) {
          responseData = StorageService.updateTimestamp(String(data.ruleMetaData.id), data.timestamp);
        } else if (action === PostMessageAction.ExportRules) {
          responseData = this.exportRules();
        } else if (action === PostMessageAction.ImportRules) {
          responseData = this.importRules(data);
        }
        sendResponse(await responseData);
      } catch (error) {
        const { version } = chrome.runtime.getManifest();
        // hot fix for unique id
        if (error.message.includes('does not have a unique ID')) {
          const ID = await StorageService.getSingleItem(StorageKey.NEXT_ID) || 1;
          StorageService.set({ [StorageKey.NEXT_ID]: ID + 50 });
          sendResponse(await this.addRule(data));
          error.message = 'handled error ID';
          handleError(error, { action: PostMessageAction[action], data: { ...data, version } });
          return;
        }
        sendResponse({ error: true, info: handleError(error, { action: PostMessageAction[action], data: { ...data, version } }) });
      }
    })();
  };

  onInstalled = async () => {
    // temp function
    StorageService.remove(StorageKey.CONFIG);
    // Temp function
    // Add 'resourceTypes' to local storage rules
    const ruleMetaData = await StorageService.getRules();
    ruleMetaData.forEach(async (item) => {
      if (!item.resourceTypes) {
        item.resourceTypes = [];
        await StorageService.set({ [item.id]: item });
      }
      const { version } = chrome.runtime.getManifest();
      if (version === '1.0.35') {
        item.lastMatchedTimestamp = item.timestamp;
        delete item.timestamp;
        await StorageService.set({ [item.id]: item });
      }
    });
  };

  onUpdatedTab = (tabId, changeInfo, tab) => {
    this.injectContentScript(tabId, changeInfo, tab);
    this.getMatchedRules(tab);
  };

  getMatchedRules = async (tab) => {
    if (tab.status === 'complete') {
      const enabledRules = await StorageService.getFilteredRules([{ key: 'enabled', value: true }]);
      const isUrlsMatch = enabledRules.some((rule) => MatcherService.isUrlsMatch(rule.source, tab.url, rule.matchType));
      const hasRedirectRule = enabledRules.some((rule) => (
        rule.pageType === PageType.REDIRECT && rule.destination
        || rule.pageType === PageType.MODIFY_RESPONSE));
      if (enabledRules.length && (isUrlsMatch || hasRedirectRule)) {
        this.throttleUpdateMatchedRulesTimestamp();
      }
    }
  };

  updateMatchedRulesTimestamp = async () => {
    try {
      const matchedRules = await RuleService.getMatchedRules();
      matchedRules.rulesMatchedInfo.forEach(({ rule, timeStamp }) => {
        StorageService.updateTimestamp(String(rule.ruleId), timeStamp);
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  injectContentScript = async (tabId, _, tab) => {
    const isUrlExluded = EXCLUDED_URLS.some((url) => tab.url?.startsWith(url));
    const filters = [{ key: 'pageType', value: PageType.MODIFY_REQUEST_BODY }, { key: 'enabled', value: true }];
    const rules = await StorageService.getFilteredRules(filters);
    if (!BSService.isSupportScripting() || isUrlExluded || !rules.length) return;
    InjectCodeService.injectContentScript(tabId, rules);
  };

  async getRule(data) {
    const ruleMetaData = await StorageService.get(String(data.id));
    return { ruleMetaData: ruleMetaData[data.id] };
  }

  async addRule({ rule, ruleMetaData }) {
    const id = await StorageService.generateNextId();
    if (rule && ruleMetaData.enabled) {
      await RuleService.set([{ ...rule, id }]);
    }
    await StorageService.set({ [id]: { ...ruleMetaData, id } });
    return { ...ruleMetaData, id };
  }

  async updateRule({ rule, ruleMetaData }) {
    if (rule && ruleMetaData.enabled) {
      await RuleService.set([rule], [rule]);
    }
    await StorageService.set({ [ruleMetaData.id]: ruleMetaData });
    return ruleMetaData;
  }

  async getStorageRules() {
    return await StorageService.getRules();
  }

  async deleteRules() {
    await RuleService.clear();
    await StorageService.clear();
  }

  async deleteRule(data) {
    await RuleService.removeById(data.id);
    await StorageService.remove(String(data.id));
  }

  async getUserId() {
    return { [StorageKey.USER_ID]: await StorageService.getUserId() };
  }

  async changeRuleStatusById({ id, checked }) {
    const ruleMetaData = await StorageService.getSingleItem(String(id));
    if (checked) {
      if (ruleMetaData.pageType !== PageType.MODIFY_REQUEST_BODY) {
        const rule = config[ruleMetaData.pageType].generateRule(ruleMetaData);
        await RuleService.set([{ ...rule, id }]);
      }
    } else {
      await RuleService.removeById(id);
    }
    await StorageService.set({ [id]: { ...ruleMetaData, enabled: checked } });
  }

  async copyRuleById({ id }) {
    const copyOriginalRule = await StorageService.getSingleItem(String(id));
    copyOriginalRule.name += ' copy';
    copyOriginalRule.lastMatchedTimestamp = null;
    await this.addRule({ ruleMetaData: copyOriginalRule });
  }

  async exportRules() {
    const storageRules = await StorageService.getRules();
    return storageRules.map((rule) => {
      const { id: _, ...restObject } = rule;
      restObject.lastMatchedTimestamp = null;
      return restObject;
    });
  }

  async importRules(ruleMetaData) {
    for (let i = 0; i < ruleMetaData.length; i++) {
      try {
        const rule = ruleMetaData[i];
        await this.addRule({
          rule: config[rule.pageType].generateRule(rule),
          ruleMetaData: ruleMetaData[i],
        });
      } catch (error) {}
    }
  }
}

new ServiceWorker();
