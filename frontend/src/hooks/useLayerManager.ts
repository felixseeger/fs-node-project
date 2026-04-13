import { useState, useCallback } from 'react';
import { RemotionLayer } from '../types/remotion';

export interface UseLayerManagerReturn {
  layers: RemotionLayer[];
  addLayer: (layer: Omit<RemotionLayer, 'id'>) => string;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<RemotionLayer>) => void;
  moveLayerZIndex: (id: string, newZIndex: number) => void;
}

export function useLayerManager(initialLayers: RemotionLayer[] = []): UseLayerManagerReturn {
  const [layers, setLayers] = useState<RemotionLayer[]>(initialLayers);

  const addLayer = useCallback((layer: Omit<RemotionLayer, 'id'>) => {
    const id = crypto.randomUUID();
    
    setLayers((prev) => {
      // Audio layers default to 10 seconds (300 frames @ 30fps) if not specified
      const durationInFrames = layer.durationInFrames || (layer.type === 'audio' ? 300 : 120);
      
      // Audio layers default to zIndex 0 (bottom) if not specified
      const zIndex = layer.zIndex !== undefined ? layer.zIndex : (layer.type === 'audio' ? 0 : prev.length);

      const newLayer: RemotionLayer = { 
        ...layer, 
        id,
        durationInFrames,
        zIndex
      };
      return [...prev, newLayer];
    });
    
    return id;
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
  }, []);

  const updateLayer = useCallback((id: string, updates: Partial<RemotionLayer>) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  }, []);

  const moveLayerZIndex = useCallback((id: string, newZIndex: number) => {
    setLayers((prev) => {
      const layerToMove = prev.find((l) => l.id === id);
      if (!layerToMove) return prev;

      const oldZIndex = layerToMove.zIndex;
      if (oldZIndex === newZIndex) return prev;

      return prev.map((layer) => {
        if (layer.id === id) {
          return { ...layer, zIndex: newZIndex };
        }
        
        // Adjust other layers' zIndex if they are affected
        if (oldZIndex < newZIndex) {
          // Moving up: shift layers between old and new down by 1
          if (layer.zIndex > oldZIndex && layer.zIndex <= newZIndex) {
            return { ...layer, zIndex: layer.zIndex - 1 };
          }
        } else {
          // Moving down: shift layers between new and old up by 1
          if (layer.zIndex >= newZIndex && layer.zIndex < oldZIndex) {
            return { ...layer, zIndex: layer.zIndex + 1 };
          }
        }
        
        return layer;
      });
    });
  }, []);

  return {
    layers,
    addLayer,
    removeLayer,
    updateLayer,
    moveLayerZIndex,
  };
}
