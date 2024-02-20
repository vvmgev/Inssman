// This file used to convert old sturctured data (rule or any data) stored in Storage
// To have backward compatibility
// All logic written in this file is TEMPORARY

import StorageService from "@/services/StorageService";
import { StorageKey } from "@/models/storageModel";

const storgeDataConverter = async () => {
  StorageService.remove(StorageKey.CONFIG);
  const ruleMetaDatas: any = await StorageService.getRules();
  const { version } = chrome.runtime.getManifest();
  for (const ruleMetaData of ruleMetaDatas) {
    // Add 'resourceTypes' to local storage rules
    if (!ruleMetaData.resourceTypes) {
      ruleMetaData.resourceTypes = [];
      await StorageService.set({ [ruleMetaData.id as number]: ruleMetaData });
    }

    // rename timestamp to lastMatchedTimestamp
    if (version === "1.0.35") {
      ruleMetaData.lastMatchedTimestamp = ruleMetaData.timestamp as number;
      delete ruleMetaData.timestamp;
      await StorageService.set({ [ruleMetaData.id as number]: ruleMetaData });
    }

    if (version > "1.0.54") {
      const { resourceTypes, requestMethods, source, matchType, ...rest } = ruleMetaData;
      // if already converted to new data structure
      if (!rest.conditions) {
        rest.connectedRuleIds = [ruleMetaData.id];
        rest.conditions = [{ source, matchType }];
        await StorageService.set({ [ruleMetaData.id as number]: rest });
      }
    }
  }
};

export default storgeDataConverter;
