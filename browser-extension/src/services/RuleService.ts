import StorageService from "@services/StorageService";
import BaseService from "@services/BaseService";
import BrowserRuleService from "@services/BrowserRuleService";
import MatcherService from "@services/MatcherService";
import generateRules from "@/options/pages/forms/generateRules";
import handleError from "@/serviceWorker/errorHandler";
import { IRuleMetaData, PageType } from "@models/formFieldModel";
import { PostMessageAction } from "@models/postMessageActionModel";
import { ListenerType } from "@services/ListenerService/ListenerService";
import { storeRuleMetaData, storeTracking } from "@/serviceWorker/firebase";
import { StorageKey } from "@models/storageModel";
import { throttle } from "@utils/throttle";

import UpdateRuleOptions = chrome.declarativeNetRequest.UpdateRuleOptions;
import Rule = chrome.declarativeNetRequest.Rule;
import MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL = chrome.declarativeNetRequest.MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL;
import GETMATCHEDRULES_QUOTA_INTERVAL = chrome.declarativeNetRequest.GETMATCHEDRULES_QUOTA_INTERVAL;

class RuleService extends BaseService {
  private listenersMap: Partial<Record<PostMessageAction, any>>;
  private throttleUpdateMatchedRulesTimestamp: () => void;

  constructor() {
    super();
    const delay = (GETMATCHEDRULES_QUOTA_INTERVAL * 60 * 1000) / MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL;
    this.throttleUpdateMatchedRulesTimestamp = throttle(this.updateMatchedRulesTimestamp, delay);

    this.addListener(ListenerType.ON_MESSAGE, this.onMessage)
      .addListener(ListenerType.ON_MESSAGE_EXTERNAL, this.onMessage)
      .addListener(ListenerType.ON_UPDATE_TAB, this.onUpdatedTab);

    this.listenersMap = {
      [PostMessageAction.GetStorageRules]: this.getStorageRules,
      [PostMessageAction.GetRuleById]: this.getRuleById,
      [PostMessageAction.AddRule]: this.addRule,
      [PostMessageAction.UpdateRule]: this.updateRule,
      [PostMessageAction.DeleteRules]: this.deleteRules,
      [PostMessageAction.DeleteRule]: this.deleteRule,
      [PostMessageAction.DuplicateRule]: this.duplicateRule,
      [PostMessageAction.ImportRules]: this.importRules,
      [PostMessageAction.ExportRules]: this.exportRules,
      [PostMessageAction.ToggleExntesion]: this.toggleExtension,
      [PostMessageAction.UpdateRuleTimestamp]: this.updateTimeStamp,
      [PostMessageAction.ToggleRule]: this.toggleRule,
    };
  }

  onUpdatedTab = (tabId, changeInfo, tab): void => {
    this.getMatchedRules(tab);
  };

  onMessage = async (request, sender, sendResponse) => {
    const handler = this.listenersMap[request.action];
    if (handler) {
      try {
        sendResponse(await handler(request.data));
      } catch (error: any) {
        const { version } = chrome.runtime.getManifest();
        // hot fix for unique id
        if (error.message.includes("does not have a unique ID")) {
          const ID: number = (await StorageService.getSingleItem(StorageKey.NEXT_ID)) || 200;
          StorageService.set({ [StorageKey.NEXT_ID]: ID + 50 });
          sendResponse(await this.addRule(request.data));
          error.message = "handled error ID";
          handleError(error, {
            action: PostMessageAction[request.action],
            data: { ...request.data, version },
          });
          return;
        }
        sendResponse({
          error: true,
          info: handleError(error, {
            action: PostMessageAction[request.action],
            data: { ...(request.data || {}), version },
          }),
        });
      }
    }
  };

  getStorageRules = async (): Promise<IRuleMetaData[]> => {
    return await StorageService.getRules();
  };

  getRuleById = async ({ id }: { id: number }): Promise<any> => {
    const ruleMetaData = await StorageService.get(String(id));
    return { ruleMetaData: ruleMetaData[id] };
  };

  addRule = async ({ ruleMetaData }: { ruleMetaData: IRuleMetaData }): Promise<IRuleMetaData> => {
    // console.log("ruleMetaData", ruleMetaData);
    // Tracking temp
    storeRuleMetaData({
      ruleMetaData,
      actionType: PostMessageAction[PostMessageAction.AddRule],
    });
    const connectedRuleIds: number[] = [];
    const rules = generateRules(ruleMetaData);
    // console.log("rules", rules);
    // @ts-ignore
    // return;
    for (const rule of rules) {
      let id: number = await StorageService.generateNextId();
      connectedRuleIds.push(id);

      if (ruleMetaData.enabled) {
        await BrowserRuleService.set([{ ...rule, id }]);
      }
    }
    await StorageService.set({ [connectedRuleIds[0]]: { ...ruleMetaData, id: connectedRuleIds[0], connectedRuleIds } });
    return { ...ruleMetaData, id: connectedRuleIds[0], connectedRuleIds };
  };

  updateRule = async ({ ruleMetaData }): Promise<IRuleMetaData> => {
    const rules = generateRules(ruleMetaData);
    // Tracking temp
    storeRuleMetaData({
      ruleMetaData,
      actionType: PostMessageAction[PostMessageAction.UpdateRule],
    });

    if (rules) {
      const removeRuleIds: number[] = [...ruleMetaData.connectedRuleIds];
      ruleMetaData.connectedRuleIds = [];
      for (const rule of rules) {
        rule.id = rule.id || (await StorageService.generateNextId());
        ruleMetaData.connectedRuleIds.push(rule.id);
      }
      if (ruleMetaData.enabled) {
        await BrowserRuleService.set(rules, removeRuleIds);
      }
    }
    await StorageService.set({ [ruleMetaData.id]: ruleMetaData });
    return ruleMetaData;
  };

  deleteRules = async (): Promise<void> => {
    await BrowserRuleService.clear();
    await StorageService.remove((await StorageService.getRules()).map(({ id }) => String(id)));
  };

  deleteRule = async ({ id, connectedRuleIds }): Promise<void> => {
    await BrowserRuleService.remove(connectedRuleIds);
    await StorageService.remove(String(id));
  };

  duplicateRule = async ({ ruleMetaData }: { ruleMetaData: IRuleMetaData }): Promise<void> => {
    ruleMetaData.name += " copy";
    ruleMetaData.lastMatchedTimestamp = null;
    await this.addRule({ ruleMetaData });
  };

  exportRules = async (): Promise<Omit<IRuleMetaData, "id">[]> => {
    const storageRules: IRuleMetaData[] = await StorageService.getRules();
    return storageRules.map((ruleMetaData: IRuleMetaData) => {
      const { id, ...restObject } = ruleMetaData;
      restObject.connectedRuleIds = [];
      restObject.lastMatchedTimestamp = null;
      restObject.enabled = true;
      return restObject;
    });
  };

  importRules = async (ruleMetaDatas: Omit<IRuleMetaData, "id">[]): Promise<void> => {
    for (const ruleMetaData of ruleMetaDatas) {
      try {
        await this.addRule({
          ruleMetaData: ruleMetaData as IRuleMetaData,
        });
      } catch (error) {}
    }
  };

  toggleExtension = async ({ checked }: { checked: boolean }): Promise<void> => {
    if (checked) {
      const ruleMetaDatas: IRuleMetaData[] = await this.getStorageRules();
      const rules: Rule[] = [];
      for (const ruleMetaData of ruleMetaDatas) {
        rules.push(...generateRules(ruleMetaData));
      }
      await BrowserRuleService.set(rules);
    } else {
      await BrowserRuleService.clear();
    }
  };

  getMatchedRules = async (tab) => {
    if (tab.status === "complete") {
      const enabledRules: IRuleMetaData[] = await StorageService.getFilteredRules([{ key: "enabled", value: true }]);
      const isUrlsMatch = enabledRules.some(({ conditions }) =>
        conditions.some((condition) => MatcherService.isUrlsMatch(condition.source, tab.url, condition.matchType))
      );
      const hasRedirectRule = enabledRules.some(
        (rule: IRuleMetaData) =>
          // On redirect url doesn't match
          (rule.pageType === PageType.REDIRECT && rule.destination) ||
          // MODIFY_RESPONSE uses REDIRECT rule
          rule.pageType === PageType.MODIFY_RESPONSE
      );
      if (enabledRules.length && (isUrlsMatch || hasRedirectRule)) {
        this.throttleUpdateMatchedRulesTimestamp();
      }
    }
  };

  updateMatchedRulesTimestamp = async (): Promise<void> => {
    try {
      const matchedRules = await BrowserRuleService.getMatchedRules();
      matchedRules.rulesMatchedInfo.forEach(({ rule, timeStamp }) => {
        this.updateTimeStamp({ id: rule.ruleId, timestamp: timeStamp });
      });
    } catch (error) {}
  };

  updateTimeStamp = (data: { id: number; timestamp: number }): void => {
    StorageService.updateRuleTimestamp(String(data.id), data.timestamp);
  };

  toggleRule = async ({ ruleMetaData, checked }: { ruleMetaData: IRuleMetaData; checked: boolean }): Promise<void> => {
    const { connectedRuleIds, pageType, id } = ruleMetaData;
    const browserRules = await BrowserRuleService.getRules(connectedRuleIds);
    const updateRuleOptions: UpdateRuleOptions = { removeRuleIds: connectedRuleIds };
    try {
      if (checked && pageType !== PageType.MODIFY_REQUEST_BODY) {
        updateRuleOptions.addRules = generateRules(ruleMetaData);
      }
      // TODO: FIXME:  need investigation
      // when checked = false
      // it doesn't remove the rule
      await BrowserRuleService.updateDynamicRules(updateRuleOptions);
      await StorageService.set({ [id]: { ...ruleMetaData, enabled: checked } });
    } catch (error) {
      handleError(error, {
        action: "ChangeRuleStatusById",
        data: { checked, browserRules, ruleMetaData },
      });
      return Promise.reject(error);
    }
  };
}

export default new RuleService();
