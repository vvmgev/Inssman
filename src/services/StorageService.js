// import CacheService from 'services/CacheService';
import { StorageItemType, StorageKey } from 'models/storageModel';

class StorageService {
  #cacheName = 'StorageService';

  async get(keys) {
    // const cache = CacheService.get(this.cacheName, keys as string);
    // if(cache) return {[keys as string]: cache};
    const data = await chrome.storage.local.get(keys);
    // for(const key in data) CacheService.set(this.cacheName, key, data[key]);
    return data;
  }

  async getRules() {
    return Object.values(await this.get()).filter((rule) => typeof rule === 'object' && rule.type === StorageItemType.RULE);
  }

  async getFilteredRules(filters) {
    const rules = await this.getRules();
    return rules.filter((rule) => filters.every((filter) => rule[filter.key] === filter.value));
  }

  async getSingleItem(key) {
    return (await this.get(key))[key];
  }

  async set(rules) {
    // for(const key in rules) CacheService.set(this.cacheName, key, rules[key]);
    return chrome.storage.local.set(rules);
  }

  async remove(key) {
    // CacheService.remove(this.cacheName, key);
    return chrome.storage.local.remove(key);
  }

  async clear() {
    return chrome.storage.local.clear();
  }

  async getAll() {
    return this.get();
  }

  async generateNextId() {
    const nextId = ((await this.getSingleItem(StorageKey.NEXT_ID)) || 1) + 1;
    this.set({ [StorageKey.NEXT_ID]: nextId });
    return nextId;
  }

  async updateTimestamp(id, timestamp = Date.now()) {
    const storageRule = await this.getSingleItem(id);
    storageRule.lastMatchedTimestamp = timestamp;
    await this.set({ [id]: storageRule });
  }

  async getUserId() {
    const timestamp = Date.now();
    const userId = await this.getSingleItem(StorageKey.USER_ID) || timestamp;
    if (userId === timestamp) {
      this.set({ [StorageKey.USER_ID]: userId });
    }
    return userId;
  }
}

export default new StorageService();
