import { StorageKey } from "../models/storageModel";
class StorageService {

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

    async setNextId(value?: number): Promise<number> {
        const id: number = value || (await this.getLastId()) || 1;
        const nextId: number = id + 1;
        await this.set({[StorageKey.NEXT_ID]: nextId});
        return nextId;
    }
}

export default new StorageService();