class CacheService {
    public cache: any = {};

    public set = (cacheKey: string, key: string, value: unknown): unknown => {
        const cache = this.cache[cacheKey] || (this.cache[cacheKey] = {});
        return cache[key] = value;
    };

    public remove = (cacheKey: string, key: string): void => {
        const cache = this.cache[cacheKey] || (this.cache[cacheKey] = {});
        delete cache[key];
    };

    public get = (cacheKey: string, key: string): unknown => {
        const cache = this.cache[cacheKey] || (this.cache[cacheKey] = {});
        return cache[key];
    };

    public clear = (): void => {
        this.cache = {};
    };
}

export default new CacheService();
