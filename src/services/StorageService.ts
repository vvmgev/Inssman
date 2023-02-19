import { StorageKey } from "../models/storageModel";
class StorageService {

    constructor() {
      // this.get().then(rules => {
      //   console.log('storage rules', rules);
      // })
      // chrome.storage.local.clear();
    }

    async get(keys?: string | string[] | { [key: string]: any } | null): Promise<{ [key: string]: any }> {
      return chrome.storage.local.get(keys);
    }

    async set(items: { [key: string]: any }): Promise<void> {
      return chrome.storage.local.set(items)
    }

    async remove(keys: string | string[]): Promise<void> {
      return chrome.storage.local.remove(keys);
    }

    async getLastId(): Promise<number> {
      const data = await this.get(StorageKey.NEXT_ID);
      return data[StorageKey.NEXT_ID];
    }

    async getAll(): Promise<{ [key: string]: any }> {
      return this.get();
    }

    async setId(id: number): Promise<number> {
      await this.set({[StorageKey.NEXT_ID]: id});
      return id;
    }

    async generateNextId(): Promise<number> {
      return ((await this.getLastId()) || 1) + 1;
    }
}

export default new StorageService();