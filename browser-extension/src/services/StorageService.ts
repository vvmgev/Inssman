// import CacheService from 'services/CacheService';
import { StorageItemType, StorageKey } from "models/storageModel";
import { IRuleMetaData } from "src/models/formFieldModel";

class StorageService {
    private readonly cacheName = 'StorageService';

    async get(keys?: string | string[] | { [key: string]: any } | null): Promise<{ [key: string]: any }> {
      // const cache = CacheService.get(this.cacheName, keys as string);
      // if(cache) return {[keys as string]: cache};
      const data = await chrome.storage.local.get(keys);
      // for(const key in data) CacheService.set(this.cacheName, key, data[key]);
      return data;
    }

    async getRules(): Promise<IRuleMetaData[]> {
      return Object.values(await this.get()).filter(rule => typeof rule === 'object' && rule.type === StorageItemType.RULE);
    }

    async getFilteredRules(filters: {[key: string]: any}[] ): Promise<IRuleMetaData[]> {
      const rules = await this.getRules();
      return rules.filter(rule => filters.every(filter => rule[filter.key] === filter.value));
    }

    async getSingleItem(key: string): Promise<any> {
      return (await this.get(key))[key];
    }

    async set(data: { [key: string]: any }): Promise<void> {
      // for(const key in data) CacheService.set(this.cacheName, key, data[key]);
      return chrome.storage.local.set(data)
    }

    async remove(key: string | string[]): Promise<void> {
      // CacheService.remove(this.cacheName, key);
      return chrome.storage.local.remove(key);
    }

    async clear(): Promise<void> {
      return chrome.storage.local.clear();
    }

    async getAll(): Promise<{ [key: string]: any }> {
      return this.get();
    }

    async generateNextId(): Promise<number> {
      const nextId: number = ((await this.getSingleItem(StorageKey.NEXT_ID)) || 1) + 1;
      this.set({[StorageKey.NEXT_ID]: nextId});
      return nextId;
    }

    async updateTimestamp(id: string, timestamp: number = Date.now()): Promise<void> {
      const storageRule = await this.getSingleItem(id);
      storageRule.lastMatchedTimestamp = timestamp;
      await this.set({[id]: storageRule});
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
