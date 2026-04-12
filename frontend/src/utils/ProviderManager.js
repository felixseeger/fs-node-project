import { useState, useEffect, useCallback } from 'react';

/**
 * Provider Configuration
 */
export const PROVIDER_CONFIG = {
  freepik: {
    name: 'Freepik',
    apiKey: process.env.FREEPIK_API_KEY,
    baseUrl: 'https://api.freepik.com/v1',
    capabilities: ['image', 'video', 'audio', 'upscale'],
    maxConcurrent: 3,
    rateLimit: 60 // requests per minute
  },
  anthropic: {
    name: 'Anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseUrl: 'https://api.anthropic.com/v1',
    capabilities: ['text', 'vision', 'analysis'],
    maxConcurrent: 5,
    rateLimit: 120
  },
  stability: {
    name: 'Stability AI',
    apiKey: process.env.STABILITY_API_KEY,
    baseUrl: 'https://api.stability.ai/v1',
    capabilities: ['image', 'video'],
    maxConcurrent: 2,
    rateLimit: 30
  },
  runway: {
    name: 'Runway ML',
    apiKey: process.env.RUNWAY_API_KEY,
    baseUrl: 'https://api.runwayml.com/v1',
    capabilities: ['video', '3d', 'motion'],
    maxConcurrent: 1,
    rateLimit: 15
  }
};

/**
 * Provider Manager Hook
 * Handles provider selection, fallback, and load balancing
 */
export function useProviderManager() {
  const [providers, setProviders] = useState({});
  const [activeProviders, setActiveProviders] = useState([]);
  const [providerStats, setProviderStats] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize provider manager with configuration
   */
  const initialize = useCallback((config = PROVIDER_CONFIG) => {
    const initializedProviders = {};
    const active = [];
    const stats = {};

    Object.entries(config).forEach(([key, provider]) => {
      if (provider.apiKey) {
        initializedProviders[key] = {
          ...provider,
          id: key,
          currentRequests: 0,
          lastUsed: null
        };
        active.push(key);
        stats[key] = {
          success: 0,
          failures: 0,
          avgResponseTime: 0,
          lastSuccess: null
        };
      }
    });

    setProviders(initializedProviders);
    setActiveProviders(active);
    setProviderStats(stats);
    setIsInitialized(true);
  }, []);

  // Auto-initialize on mount
    useEffect(() => {
    if (!isInitialized) {
      // eslint-disable-next-line
      initialize();
    }
  }, [isInitialized, initialize]);

  /**
   * Select a provider based on capability and preferences
   */
  const selectProvider = useCallback((capability, preferences = []) => {
    const availableProviders = activeProviders
      .filter(id => providers[id].capabilities.includes(capability))
      .sort((a, b) => {
        // Sort by preference first
        const aPrefIndex = preferences.indexOf(a);
        const bPrefIndex = preferences.indexOf(b);
        if (aPrefIndex !== -1 && bPrefIndex !== -1) return aPrefIndex - bPrefIndex;
        if (aPrefIndex !== -1) return -1;
        if (bPrefIndex !== -1) return 1;
        
        return 0; // Or add load balancing logic here
      });

    return availableProviders.length > 0 ? providers[availableProviders[0]] : null;
  }, [providers, activeProviders]);

  /**
   * Update provider status and statistics
   */
  const updateProviderStats = useCallback((providerId, success, responseTime) => {
    setProviders(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        currentRequests: prev[providerId].currentRequests - 1,
        lastUsed: new Date()
      }
    }));

    setProviderStats(prev => {
      const totalRequests = prev[providerId].success + prev[providerId].failures;
      const newAvg = ((prev[providerId].avgResponseTime * totalRequests) + responseTime) / (totalRequests + 1);

      return {
        ...prev,
        [providerId]: {
          ...prev[providerId],
          success: success ? prev[providerId].success + 1 : prev[providerId].success,
          failures: success ? prev[providerId].failures : prev[providerId].failures + 1,
          avgResponseTime: newAvg,
          lastSuccess: success ? new Date() : prev[providerId].lastSuccess
        }
      };
    });
  }, []);

  /**
   * Handle provider request with automatic retry and fallback
   */
  const makeRequest = useCallback(async (capability, requestFn, preferences = [], maxRetries = 2) => {
    if (!isInitialized) {
      throw new Error('Provider manager not initialized');
    }

    // Filter providers by capability and preference
    const availableProviders = activeProviders
      .filter(id => providers[id].capabilities.includes(capability))
      .sort((a, b) => {
        // Sort by preference, then by success rate
        const aPrefIndex = preferences.indexOf(a);
        const bPrefIndex = preferences.indexOf(b);
        if (aPrefIndex !== bPrefIndex) return aPrefIndex - bPrefIndex;
        
        const aSuccessRate = providerStats[a].success / (providerStats[a].success + providerStats[a].failures || 1);
        const bSuccessRate = providerStats[b].success / (providerStats[b].success + providerStats[b].failures || 1);
        return bSuccessRate - aSuccessRate;
      });

    if (availableProviders.length === 0) {
      throw new Error(`No providers available for capability: ${capability}`);
    }

    let lastError = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const providerId = availableProviders[attempt % availableProviders.length];
      const provider = providers[providerId];

      try {
        // Update request count
        setProviders(prev => ({
          ...prev,
          [providerId]: {
            ...prev[providerId],
            currentRequests: prev[providerId].currentRequests + 1
          }
        }));

        const startTime = Date.now();
        const result = await requestFn(provider);
        const endTime = Date.now();

        // Update stats on success
        updateProviderStats(providerId, true, endTime - startTime);
        
        return result;
      } catch (error) {
        lastError = error;
        updateProviderStats(providerId, false, 0);
        
        // If this was the last attempt, throw the error
        if (attempt === maxRetries - 1) {
          throw new Error(`All providers failed for ${capability}: ${lastError.message}`);
        }
      }
    }
  }, [providers, activeProviders, providerStats, isInitialized, updateProviderStats]);

  /**
   * Check provider health status
   */
  const checkProviderHealth = useCallback(() => {
    return activeProviders.map(id => ({
      id,
      name: providers[id].name,
      status: providerStats[id].failures > 3 ? 'degraded' : 'healthy',
      successRate: providerStats[id].success / (providerStats[id].success + providerStats[id].failures || 1)
    }));
  }, [providers, activeProviders, providerStats]);

  /**
   * Get current provider statistics
   */
  const getProviderStats = useCallback(() => providerStats, [providerStats]);

  /**
   * Get available providers
   */
  const getProviders = useCallback(() => providers, [providers]);

  /**
   * Get providers status
   */
  const getProvidersStatus = useCallback(() => {
    return activeProviders.map(id => ({
      id,
      name: providers[id].name,
      currentRequests: providers[id].currentRequests,
      lastUsed: providers[id].lastUsed,
      status: providerStats[id].failures > 3 ? 'degraded' : 'healthy'
    }));
  }, [providers, activeProviders, providerStats]);

  return {
    providers,
    activeProviders,
    providerStats,
    isInitialized,
    initialize,
    selectProvider,
    makeRequest,
    checkProviderHealth,
    getProviderStats,
    getProviders,
    getProvidersStatus
  };
}

/**
 * Provider Request Wrapper
 * Wraps API calls with provider management
 */
export async function withProviderManagement(capability, requestFn, options = {}) {
  const { preferences = [], maxRetries = 2 } = options;

  // This would use the hook in a React component context
  // For standalone usage, we'll use a simplified approach
  const provider = PROVIDER_CONFIG[capability];
  
  if (!provider || !provider.apiKey) {
    throw new Error(`No configured provider for capability: ${capability}`);
  }

  return requestFn(provider);
}

/**
 * Get all providers that support a specific capability
 */
export function getProvidersForCapability(capability) {
  return Object.entries(PROVIDER_CONFIG)
    .filter(([_, provider]) => provider.apiKey && provider.capabilities.includes(capability))
    .map(([id, provider]) => ({ id, ...provider }));
}