// Create a cache object for player search results
export const cache = new Map();

// Get data from cache
export const getFromCache = (query) => {
  return cache.get(query);
};

// Set data to cache
export const setCache = (query, data) => {
  cache.set(query, data);
};

// Clear cache (optional utility)
export const clearCache = () => {
  cache.clear();
};
