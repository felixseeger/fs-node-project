import { useState, useCallback, useEffect, useRef } from 'react';
import { RemotionLayer } from '../types/remotion';

export interface UseLayerManagerReturn {
  layers: RemotionLayer[];
  addLayer: (layer: Omit<RemotionLayer, 'id'>) => string;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<RemotionLayer>) => void;
  moveLayerZIndex: (id: string, newZIndex: number) => void;
}

export function useLayerManager(
  initialLayers: RemotionLayer[] = [],
  onLayersChange?: (newLayers: RemotionLayer[]) => void
): UseLayerManagerReturn {
  const [layers, setLayers] = useState<RemotionLayer[]>(initialLayers);
  
  // Track initial layers separately to avoid unnecessary triggers
  useEffect(() => {
    // Only update if they are fundamentally different to avoid loop
    if (JSON.stringify(initialLayers) !== JSON.stringify(layers) && initialLayers.length > 0 && layers.length === 0) {
      setLayers(initialLayers);
    }
  }, [initialLayers]);

  // Sync changes safely without side-effects in setters
  useEffect(() => {
    onLayersChange?.(layers);
  }, [layers, onLayersChange]);

  const addLayer = useCallback((layer: Omit<RemotionLayer, 'id'>) => {
    const id = crypto.randomUUID();
    let newId = id;
    
    setLayers((prev) => {
      const durationInFrames = layer.durationInFrames || (layer.type === 'audio' ? 300 : 120);
      const zIndex = layer.zIndex !== undefined ? layer.zIndex : (layer.type === 'audio' ? 0 : prev.length);

      const newLayer: RemotionLayer = { 
        ...layer, 
        id,
        durationInFrames,
        zIndex,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1
      };
      
      return [...prev, newLayer];
    });
    
    return newId;
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
  }, []);

  const updateLayer = useCallback((id: string, updates: Partial<RemotionLayer>) => {
    setLayers((prev) => prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer)));
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
        
        if (oldZIndex < newZIndex) {
          if (layer.zIndex > oldZIndex && layer.zIndex <= newZIndex) {
            return { ...layer, zIndex: layer.zIndex - 1 };
          }
        } else {
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
