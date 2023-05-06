import { StorageItemType, StorageKey } from "models/storageModel";
import { IRuleData } from "src/models/formFieldModel";
class StorageService {

    async get(keys?: string | string[] | { [key: string]: any } | null): Promise<{ [key: string]: any }> {
      return chrome.storage.local.get(keys);
    }

    async getRules(): Promise<IRuleData[]> {
      return Object.values(await this.get()).filter(rule => typeof rule === 'object' && rule.type === StorageItemType.RULE);
    }

    async getEnabledRules(): Promise<IRuleData[]> {
      return Object.values(await this.getRules()).filter(rule => typeof rule === 'object' && rule.enabled);
    }

    async getSingleItem(key: string): Promise<any> {
      return (await this.get(key))[key];
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
      return ((await this.getSingleItem(StorageKey.NEXT_ID)) || 1) + 1;
    }

    async getUserId(): Promise<any> {
      let userId: number | undefined = await this.getSingleItem(StorageKey.USER_ID);
      if(typeof userId === 'undefined') {
        userId = Date.now();
        await this.set({[StorageKey.USER_ID]: userId});
      }
      return {[StorageKey.USER_ID]: userId};
    }
}

export default new StorageService();