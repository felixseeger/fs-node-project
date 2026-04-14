import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addToHistory, getHistory, clearHistory, searchHistory } from '../historyService';
import { uploadAssetToStorage } from '../storageService';

// Mock dependencies
vi.mock('../storageService', () => ({
  uploadAssetToStorage: vi.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn(key => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('historyService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.clear();
    
    // Default mocks
    vi.mocked(uploadAssetToStorage).mockImplementation(async (uri) => {
      if (uri.startsWith('data:') || uri.startsWith('blob:')) {
        return 'https://firebasestorage.googleapis.com/mock-history-url';
      }
      return uri;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('addToHistory', () => {
    it('should add an item to history', async () => {
      const item = {
        type: 'image',
        url: 'https://example.com/image.png',
        prompt: 'test prompt',
        nodeType: 'imageNode',
        nodeLabel: 'Image',
      };

      const result = await addToHistory(item);

      expect(result.id).toBeDefined();
      expect(result.type).toBe('image');
      expect(result.url).toBe('https://example.com/image.png');
      expect(result.prompt).toBe('test prompt');
      expect(result.createdAt).toBeDefined();

      const history = getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe(result.id);
    });

    it('should upload asset if URL is data URI', async () => {
      const item = {
        type: 'image',
        url: 'data:image/png;base64,mock',
        prompt: 'test prompt',
        nodeType: 'imageNode',
        nodeLabel: 'Image',
      };

      const result = await addToHistory(item);

      expect(uploadAssetToStorage).toHaveBeenCalledWith('data:image/png;base64,mock', 'history');
      expect(result.url).toBe('https://firebasestorage.googleapis.com/mock-history-url');
      
      const history = getHistory();
      expect(history[0].url).toBe('https://firebasestorage.googleapis.com/mock-history-url');
    });

    it('should upload asset if URL is blob URI', async () => {
      const item = {
        type: 'image',
        url: 'blob:http://localhost/mock-blob',
        prompt: 'test prompt',
      };

      const result = await addToHistory(item);

      expect(uploadAssetToStorage).toHaveBeenCalledWith('blob:http://localhost/mock-blob', 'history');
      expect(result.url).toBe('https://firebasestorage.googleapis.com/mock-history-url');
    });

    it('should handle upload failure by keeping original URL', async () => {
      vi.mocked(uploadAssetToStorage).mockRejectedValue(new Error('Upload failed'));
      
      const item = {
        type: 'image',
        url: 'data:image/png;base64,mock',
        prompt: 'test prompt',
      };

      const result = await addToHistory(item);
      expect(result.url).toBe('data:image/png;base64,mock');
    });

    it('should limit history items to MAX_ITEMS', async () => {
      // Add many items
      for (let i = 0; i < 505; i++) {
        await addToHistory({
          type: 'image',
          url: `https://example.com/image${i}.png`,
          prompt: `prompt ${i}`,
        });
      }

      const history = getHistory();
      expect(history.length).toBeLessThanOrEqual(500);
      expect(history[0].prompt).toBe('prompt 504');
    });
  });

  describe('searchHistory', () => {
    it('should filter items based on query', async () => {
      await addToHistory({ type: 'image', url: 'url1', prompt: 'cat sitting' });
      await addToHistory({ type: 'image', url: 'url2', prompt: 'dog running' });
      await addToHistory({ type: 'image', url: 'url3', prompt: 'cat sleeping' });

      const results = searchHistory('cat');
      expect(results).toHaveLength(2);
      expect(results[0].prompt).toBe('cat sleeping');
      expect(results[1].prompt).toBe('cat sitting');
    });

    it('should be case insensitive', async () => {
      await addToHistory({ type: 'image', url: 'url1', prompt: 'Cat sitting' });
      const results = searchHistory('CAT');
      expect(results).toHaveLength(1);
    });
  });
});
