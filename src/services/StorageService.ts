import { StorageItemType, StorageKey } from "models/storageModel";
import { IRuleData } from "src/models/formFieldModel";
class StorageService {

    async get(keys?: string | string[] | { [key: string]: any } | null): Promise<{ [key: string]: any }> {
      return chrome.storage.local.get(keys);
    }

    async getEnabledRules(): Promise<IRuleData[]> {
      return Object.values(await this.getRules()).filter(rule => typeof rule === 'object' && rule.enabled);
    }

    async getRules(): Promise<IRuleData[]> {
      return Object.values(await this.get()).filter(rule => typeof rule === 'object' && rule.type === StorageItemType.RULE);
    }

    async set(items: { [key: string]: any }): Promise<void> {
      return chrome.storage.local.set(items)
    }

    async remove(rules: IRuleData[]): Promise<void> {
      const keys: string[] = rules.map(({id}) => String(id));
      return chrome.storage.local.remove(keys);
    }

    async removeById(key: string): Promise<void> {
      return chrome.storage.local.remove(key);
    }

    async getAll(): Promise<{ [key: string]: any }> {
      return this.get();
    }

    async generateNextId(): Promise<number> {
      return (((await this.get(StorageKey.NEXT_ID))[StorageKey.NEXT_ID]) || 1) + 1;
    }

    async getUserId(): Promise<any> {
      const data = await this.get([StorageKey.USER_ID]);
      let userId: number | undefined;
      if(typeof data[StorageKey.USER_ID] === 'undefined') {
        userId = Date.now();
        await this.set({[StorageKey.USER_ID]: userId});
      }
      return (userId && {[StorageKey.USER_ID]: userId}) || data;
    }
}

export default new StorageService();