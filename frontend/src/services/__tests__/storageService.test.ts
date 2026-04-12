import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { uploadAssetToStorage, processAssetsInObject } from '../storageService';
import { isFirebaseConfigured, getFirebaseStorage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Mock dependencies
vi.mock('../../config/firebase', () => ({
  isFirebaseConfigured: vi.fn(),
  getFirebaseStorage: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

describe('storageService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mocks
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(getFirebaseStorage).mockReturnValue({});
    vi.mocked(ref).mockReturnValue({});
    vi.mocked(uploadBytes).mockResolvedValue({} as any);
    vi.mocked(getDownloadURL).mockResolvedValue('https://firebasestorage.googleapis.com/mock-url');

    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['mock data'], { type: 'image/png' }))
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('uploadAssetToStorage', () => {
    it('should return original URI if Firebase is not configured', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(false);
      const result = await uploadAssetToStorage('data:image/png;base64,mock');
      expect(result).toBe('data:image/png;base64,mock');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return original URI if not a blob or data URI', async () => {
      const result = await uploadAssetToStorage('https://example.com/image.png');
      expect(result).toBe('https://example.com/image.png');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should upload and return download URL for data URI', async () => {
      const result = await uploadAssetToStorage('data:image/png;base64,mock');
      expect(global.fetch).toHaveBeenCalledWith('data:image/png;base64,mock');
      expect(uploadBytes).toHaveBeenCalled();
      expect(getDownloadURL).toHaveBeenCalled();
      expect(result).toBe('https://firebasestorage.googleapis.com/mock-url');
    });

    it('should return original URI if upload fails', async () => {
      vi.mocked(uploadBytes).mockRejectedValue(new Error('Upload failed'));
      const result = await uploadAssetToStorage('data:image/png;base64,mock');
      expect(result).toBe('data:image/png;base64,mock');
    });
  });

  describe('processAssetsInObject', () => {
    it('should recursively replace data URIs with storage URLs', async () => {
      const input = {
        name: 'Test Workflow',
        nodes: [
          {
            id: '1',
            data: {
              image: 'data:image/png;base64,mock',
              otherText: 'hello',
              nested: {
                video: 'blob:http://localhost/mock-blob'
              }
            }
          }
        ],
        ignore: 'normal string'
      };

      const result = await processAssetsInObject(input);

      expect(result.name).toBe('Test Workflow');
      expect(result.nodes[0].data.image).toBe('https://firebasestorage.googleapis.com/mock-url');
      expect(result.nodes[0].data.otherText).toBe('hello');
      expect(result.nodes[0].data.nested.video).toBe('https://firebasestorage.googleapis.com/mock-url');
      expect(result.ignore).toBe('normal string');
      
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle null or non-objects', async () => {
      expect(await processAssetsInObject(null)).toBeNull();
      expect(await processAssetsInObject('test')).toBe('test');
    });
  });
});
