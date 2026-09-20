// Test environment setup & polyfills for Vitest
if (typeof window === 'undefined') {
  global.window = {
    location: { href: '', pathname: '/' }
  };
}

const storage = new Map();
global.localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
  get length() { return storage.size; }
};

const { apiClient } = await import('../src/infrastructure/api/client.js');
const { handleMockRequest } = await import('./mocks/mockAdapter.js');

// Route vitest requests to isolated test mock adapter
apiClient.defaults.adapter = async (config) => {
  return handleMockRequest(config);
};
