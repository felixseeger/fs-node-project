/**
 * Provider Manager Tests
 * Comprehensive test suite for advanced provider integration
 */

import { renderHook, act } from '@testing-library/react';
import { useProviderManager, PROVIDER_CONFIG, getProvidersForCapability } from '../ProviderManager';

// Mock environment variables
beforeAll(() => {
  process.env.FREEPIK_API_KEY = 'test-freepik-key';
  process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
  process.env.STABILITY_API_KEY = ''; // No key for this provider
  process.env.RUNWAY_API_KEY = 'test-runway-key';
});

describe('Provider Manager', () => {
  test('initializes with configured providers', () => {
    const { result } = renderHook(() => useProviderManager());
    
    expect(result.current.isInitialized).toBe(true);
    expect(result.current.activeProviders.length).toBeGreaterThan(0);
    expect(result.current.activeProviders).toContain('freepik');
    expect(result.current.activeProviders).toContain('anthropic');
    expect(result.current.activeProviders).toContain('runway');
    // stability should not be active (no API key)
    expect(result.current.activeProviders).not.toContain('stability');
  });

  test('selects provider based on capability', () => {
    const { result } = renderHook(() => useProviderManager());
    
    // Test image capability
    const imageProvider = result.current.selectProvider('image');
    expect(imageProvider).toBeDefined();
    expect(['freepik', 'stability', 'runway']).toContain(imageProvider.name.toLowerCase());
    
    // Test video capability
    const videoProvider = result.current.selectProvider('video');
    expect(videoProvider).toBeDefined();
    expect(['freepik', 'runway']).toContain(videoProvider.name.toLowerCase());
    
    // Test text capability
    const textProvider = result.current.selectProvider('text');
    expect(textProvider).toBeDefined();
    expect(textProvider.name.toLowerCase()).toBe('anthropic');
  });

  test('respects provider preferences', () => {
    const { result } = renderHook(() => useProviderManager());
    
    // Prefer freepik for image generation
    const preferredProvider = result.current.selectProvider('image', ['freepik']);
    expect(preferredProvider.name.toLowerCase()).toBe('freepik');
    
    // Prefer non-existent provider, should fallback
    const fallbackProvider = result.current.selectProvider('image', ['nonexistent', 'anthropic']);
    expect(fallbackProvider).toBeDefined();
  });

  test('returns null for unsupported capabilities', () => {
    const { result } = renderHook(() => useProviderManager());
    
    const unsupportedProvider = result.current.selectProvider('unsupported-capability');
    expect(unsupportedProvider).toBeNull();
  });

  test('updates provider statistics', () => {
    const { result } = renderHook(() => useProviderManager());
    
    // Initial stats should exist
    expect(result.current.providerStats.freepik).toBeDefined();
    expect(result.current.providerStats.freepik.success).toBe(0);
    
    // Simulate successful request
    act(() => {
      result.current.updateProviderStats('freepik', true, 150);
    });
    
    expect(result.current.providerStats.freepik.success).toBe(1);
    expect(result.current.providerStats.freepik.avgResponseTime).toBe(150);
  });

  test('handles provider request failures', async () => {
    const { result } = renderHook(() => useProviderManager());
    
    // Mock a failing request function
    const failingRequest = () => Promise.reject(new Error('API failure'));
    
    await expect(
      result.current.makeRequest('image', failingRequest, [], 1)
    ).rejects.toThrow('API failure');
    
    // Check that failure was recorded
    expect(result.current.providerStats.freepik.failures).toBeGreaterThan(0);
  });

  test('provides provider status information', () => {
    const { result } = renderHook(() => useProviderManager());
    
    const statuses = result.current.getProvidersStatus();
    expect(statuses.length).toBeGreaterThan(0);
    
    const freepikStatus = statuses.find(s => s.id === 'freepik');
    expect(freepikStatus).toBeDefined();
    expect(freepikStatus.name).toBe('Freepik');
    expect(freepikStatus.status).toBe('active');
  });
});

describe('Provider Configuration', () => {
  test('contains all expected providers', () => {
    expect(Object.keys(PROVIDER_CONFIG)).toEqual([
      'freepik',
      'anthropic',
      'stability',
      'runway'
    ]);
  });

  test('each provider has required configuration', () => {
    Object.values(PROVIDER_CONFIG).forEach(provider => {
      expect(provider).toHaveProperty('name');
      expect(provider).toHaveProperty('apiKey');
      expect(provider).toHaveProperty('baseUrl');
      expect(provider).toHaveProperty('capabilities');
      expect(provider).toHaveProperty('maxConcurrent');
      expect(provider).toHaveProperty('rateLimit');
      expect(Array.isArray(provider.capabilities)).toBe(true);
    });
  });
});

describe('Provider Utility Functions', () => {
  test('getProvidersForCapability filters correctly', () => {
    const imageProviders = getProvidersForCapability('image');
    expect(imageProviders.length).toBeGreaterThan(0);
    imageProviders.forEach(provider => {
      expect(provider.capabilities).toContain('image');
    });
    
    const videoProviders = getProvidersForCapability('video');
    expect(videoProviders.length).toBeGreaterThan(0);
    videoProviders.forEach(provider => {
      expect(provider.capabilities).toContain('video');
    });
    
    const unsupportedProviders = getProvidersForCapability('unsupported');
    expect(unsupportedProviders.length).toBe(0);
  });

  test('filters out providers without API keys', () => {
    const providers = getProvidersForCapability('image');
    // stability has no API key, so should be filtered out
    expect(providers.some(p => p.id === 'stability')).toBe(false);
  });
});

// Additional tests that would be valuable:
// - Test provider fallback mechanism
// - Test load balancing between providers
// - Test rate limiting behavior
// - Test health check functionality
// - Test concurrent request handling