import StorageService from "@services/StorageService";
import BaseService from "@services/BaseService";
import BrowserRuleService from "@services/BrowserRuleService";
import config from "@options/formBuilder/config";
import handleError from "@/serviceWorker/errorHandler";
import { IRuleMetaData, PageType } from "@models/formFieldModel";
import { PostMessageAction } from "@models/postMessageActionModel";
import { ListenerType } from "@services/ListenerService/ListenerService";
import { storeRuleMetaData, storeTracking } from "@/serviceWorker/firebase";
import { StorageKey } from "@models/storageModel";

import UpdateRuleOptions = chrome.declarativeNetRequest.UpdateRuleOptions;
import Rule = chrome.declarativeNetRequest.Rule;

class RuleService extends BaseService {
  private listenersMap: Partial<Record<PostMessageAction, any>>;

  constructor() {
    super();
    this.addListener(ListenerType.ON_MESSAGE, this.onMessage).addListener(
      ListenerType.ON_MESSAGE_EXTERNAL,
      this.onMessage
    );
    this.listenersMap = {
      [PostMessageAction.GetStorageRules]: this.getStorageRules,
      [PostMessageAction.GetRuleById]: this.getRuleById,
      [PostMessageAction.AddRule]: this.addRule,
      [PostMessageAction.UpdateRule]: this.updateRule,
      [PostMessageAction.DeleteRules]: this.deleteRules,
      [PostMessageAction.DeleteRule]: this.deleteRule,
      [PostMessageAction.CopyRuleById]: this.copyRuleById,
      [PostMessageAction.ImportRules]: this.importRules,
      [PostMessageAction.ExportRules]: this.exportRules,
      [PostMessageAction.ToggleExntesion]: this.toggleRules,
      [PostMessageAction.UpdateRuleTimestamp]: this.updateTimeStamp,
      [PostMessageAction.ChangeRuleStatusById]: this.changeRuleStatusById,
    };
  }

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

  addRule = async ({ rule, ruleMetaData }: { rule?; ruleMetaData: IRuleMetaData }): Promise<IRuleMetaData> => {
    // Tracking temp
    storeRuleMetaData({
      ruleMetaData,
      actionType: PostMessageAction[PostMessageAction.AddRule],
    });
    const id: number = await StorageService.generateNextId();
    if (rule && ruleMetaData.enabled) {
      await BrowserRuleService.set([{ ...rule, id }]);
    }
    await StorageService.set({ [id]: { ...ruleMetaData, id } });
    return { ...ruleMetaData, id };
  };

  updateRule = async ({ rule, ruleMetaData }): Promise<IRuleMetaData> => {
    // Tracking temp
    storeRuleMetaData({
      ruleMetaData,
      actionType: PostMessageAction[PostMessageAction.UpdateRule],
    });

    if (rule && ruleMetaData.enabled) {
      await BrowserRuleService.set([rule], [rule]);
    }
    await StorageService.set({ [ruleMetaData.id]: ruleMetaData });
    return ruleMetaData;
  };

  deleteRules = async (): Promise<void> => {
    await BrowserRuleService.clear();
    await StorageService.remove((await StorageService.getRules()).map(({ id }) => String(id)));
  };

  deleteRule = async (data): Promise<void> => {
    await BrowserRuleService.removeById(data.id);
    await StorageService.remove(String(data.id));
  };

  copyRuleById = async ({ id }: { id: number }): Promise<void> => {
    const copyOriginalRule = await StorageService.getSingleItem(String(id));
    copyOriginalRule.name += " copy";
    copyOriginalRule.lastMatchedTimestamp = null;
    await this.addRule({ ruleMetaData: copyOriginalRule });
  };

  exportRules = async (): Promise<Omit<IRuleMetaData, "id">[]> => {
    const storageRules: IRuleMetaData[] = await StorageService.getRules();
    return storageRules.map((rule: IRuleMetaData) => {
      const { id, ...restObject } = rule;
      restObject.lastMatchedTimestamp = null;
      return restObject;
    });
  };

  importRules = async (ruleMetaDatas: Omit<IRuleMetaData, "id">[]): Promise<void> => {
    for (const ruleMetaData of ruleMetaDatas) {
      try {
        const rule: Omit<IRuleMetaData, "id"> = ruleMetaData;
        await this.addRule({
          rule: config[rule.pageType].generateRule(rule),
          ruleMetaData: ruleMetaData as IRuleMetaData,
        });
      } catch (error) {}
    }
  };

  toggleRules = async ({ checked }: { checked: boolean }): Promise<void> => {
    if (checked) {
      const ruleMetaDatas: IRuleMetaData[] = await this.getStorageRules();
      for (const ruleMetaData of ruleMetaDatas) {
        const rule: Rule = config[ruleMetaData.pageType].generateRule(ruleMetaData);
        await BrowserRuleService.set([{ ...rule, id: ruleMetaData.id }]);
      }
    } else {
      await BrowserRuleService.clear();
    }
  };

  updateTimeStamp = (data: { ruleMetaData: IRuleMetaData; timestamp: number }): void => {
    StorageService.updateRuleTimestamp(String(data.ruleMetaData.id), data.timestamp);
  };

  changeRuleStatusById = async ({ id, checked }: { id: number; checked: boolean }): Promise<void> => {
    const ruleMetaData: IRuleMetaData = await StorageService.getSingleItem(String(id));
    const ruleServiceRule = await BrowserRuleService.getRuleById(id);
    const updateRuleOptions: UpdateRuleOptions = { removeRuleIds: [id] };
    try {
      if (checked && ruleMetaData.pageType !== PageType.MODIFY_REQUEST_BODY) {
        const rule: Rule = config[ruleMetaData.pageType].generateRule(ruleMetaData);
        updateRuleOptions.addRules = [{ ...rule, id }];
      }
      // TODO: FIXME:  need investigation
      // when checked = false
      // it doesn't remove the rule
      await BrowserRuleService.updateDynamicRules(updateRuleOptions);
      await StorageService.set({ [id]: { ...ruleMetaData, enabled: checked } });
      if (!checked) {
        const ruleServiceRuleRemoved = await BrowserRuleService.getRuleById(id);
        storeTracking({
          action: "ChangeRuleStatusById",
          data: {
            checked,
            ruleMetaData,
            ruleServiceRule: ruleServiceRule || "undefined",
            ruleServiceRuleRemoved: ruleServiceRuleRemoved || "undefined",
          },
        });
      }
    } catch (error) {
      handleError(error, {
        action: "ChangeRuleStatusById",
        data: { checked, ruleServiceRule, ruleMetaData },
      });
      return Promise.reject(error);
    }
  };
}

export default new RuleService();
