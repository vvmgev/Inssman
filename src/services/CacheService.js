class CacheService {
  cache = {};

  set = (cacheKey, key, value) => {
    const cache = this.cache[cacheKey] || (this.cache[cacheKey] = {});
    return cache[key] = value;
  };

  remove = (cacheKey, key) => {
    const cache = this.cache[cacheKey] || (this.cache[cacheKey] = {});
    delete cache[key];
  };

  get = (cacheKey, key) => {
    const cache = this.cache[cacheKey] || (this.cache[cacheKey] = {});
    return cache[key];
  };

  clear = () => {
    this.cache = {};
  };
}

export default new CacheService();
