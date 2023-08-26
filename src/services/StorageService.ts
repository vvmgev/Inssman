// import CacheService from 'services/CacheService';
import { StorageItemType, StorageKey } from "models/storageModel";
import { IRuleData } from "src/models/formFieldModel";
import RulesMatchedDetails = chrome.declarativeNetRequest.RulesMatchedDetails;

class StorageService {
    private readonly cacheName = 'StorageService';

    async get(keys?: string | string[] | { [key: string]: any } | null): Promise<{ [key: string]: any }> {
      // const cache = CacheService.get(this.cacheName, keys as string);
      // if(cache) return {[keys as string]: cache};
      const data = await chrome.storage.local.get(keys);
      // for(const key in data) CacheService.set(this.cacheName, key, data[key]);
      return data;
    }

    async getRules(): Promise<IRuleData[]> {
      return Object.values(await this.get()).filter(rule => typeof rule === 'object' && rule.type === StorageItemType.RULE);
    }

    async getFilteredRules(filters: {[key: string]: any}[] ): Promise<IRuleData[]> {
      const rules = await this.getRules();
      return rules.filter(rule => filters.every(filter => rule[filter.key] === filter.value));
    }

    async getSingleItem(key: string): Promise<any> {
      return (await this.get(key))[key];
    }

    async set(rules: { [key: string]: any }): Promise<void> {
      // for(const key in rules) CacheService.set(this.cacheName, key, rules[key]);
      return chrome.storage.local.set(rules)
    }

    async remove(key: string): Promise<void> {
      // CacheService.remove(this.cacheName, key);
      return chrome.storage.local.remove(key);
    }

    async getAll(): Promise<{ [key: string]: any }> {
      return this.get();
    }

    async generateNextId(): Promise<number> {
      return ((await this.getSingleItem(StorageKey.NEXT_ID)) || 1) + 1;
    }

    updateTimestamp(rules: RulesMatchedDetails): void {
      rules.rulesMatchedInfo.forEach(async (ruleInfo) => {
        const { rule, timeStamp } = ruleInfo;
        const storageRule = await this.getSingleItem(String(rule.ruleId));
        storageRule.lastMatchedTimestamp = timeStamp;
        await this.set({[rule.ruleId]: storageRule});
      });
    }

    async getUserId(): Promise<number> {
      const timestamp: number = Date.now();
      const userId: number = await this.getSingleItem(StorageKey.USER_ID) || timestamp;
      if(userId === timestamp) {
        this.set({[StorageKey.USER_ID]: userId});
      }
      return userId;
    }
}

export default new StorageService();