import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safeJson, uploadImages } from './api';

// Mock fetch
global.fetch = vi.fn();

describe('api.js safeJson', () => {
  it('returns parsed JSON for successful response', async () => {
    const mockRes = {
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ success: true, data: 'test' }))
    };
    
    const result = await safeJson(mockRes);
    expect(result).toEqual({ success: true, data: 'test' });
  });

  it('returns structured error for empty response with error status', async () => {
    const mockRes = {
      ok: false,
      status: 502,
      text: () => Promise.resolve('')
    };
    
    const result = await safeJson(mockRes);
    expect(result.error.message).toContain('HTTP 502: Empty response');
    expect(result.error.status).toBe(502);
  });

  it('returns structured error for HTML/non-JSON response with error status', async () => {
    const mockRes = {
      ok: false,
      status: 500,
      text: () => Promise.resolve('<html><body>Error</body></html>')
    };
    
    const result = await safeJson(mockRes);
    expect(result.error.message).toContain('HTTP 500: <html><body>Error</body></html>');
    expect(result.error.status).toBe(500);
  });

  it('handles STORAGE_LIMIT_EXCEEDED with 403', async () => {
    const mockRes = {
      ok: false,
      status: 403,
      text: () => Promise.resolve(JSON.stringify({ 
        error: 'Limit reached', 
        code: 'STORAGE_LIMIT_EXCEEDED',
        limit: 100,
        current: 100
      }))
    };
    
    // Mock dispatchEvent
    global.window = { dispatchEvent: vi.fn() };
    
    try {
      await safeJson(mockRes);
    } catch (e) {
      expect(e.status).toBe(403);
      expect(e.message).toBe('Limit reached');
      expect(global.window.dispatchEvent).toHaveBeenCalled();
    }
  });
});

describe('api.js uploadImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns result on success', async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ status: 'success', urls: ['url1'] }))
    });
    
    const result = await uploadImages([new File([], 'test.png')]);
    expect(result.urls).toEqual(['url1']);
  });

  it('throws error on server error status', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 502,
      text: () => Promise.resolve('')
    });
    
    await expect(uploadImages([new File([], 'test.png')]))
      .rejects.toThrow('HTTP 502: Empty response from server');
  });

  it('throws error with server message when available', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve(JSON.stringify({ error: 'Custom error message' }))
    });
    
    await expect(uploadImages([new File([], 'test.png')]))
      .rejects.toThrow('Custom error message');
  });
});
