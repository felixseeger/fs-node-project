import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLayerManager } from '../useLayerManager';
import { RemotionLayer } from '../../types/remotion';

describe('useLayerManager', () => {
  it('initializes with default layers', () => {
    const initialLayers: RemotionLayer[] = [{
      id: '1',
      type: 'image',
      url: 'test.jpg',
      durationInFrames: 100,
      zIndex: 0,
      x: 0, y: 0, scale: 1, opacity: 1
    }];

    const { result } = renderHook(() => useLayerManager(initialLayers));

    expect(result.current.layers).toEqual(initialLayers);
  });

  it('adds a new layer correctly', () => {
    const onLayersChange = vi.fn();
    const { result } = renderHook(() => useLayerManager([], onLayersChange));

    act(() => {
      result.current.addLayer({
        type: 'image',
        url: 'test.jpg'
      });
    });

    expect(result.current.layers.length).toBe(1);
    expect(result.current.layers[0].type).toBe('image');
    expect(result.current.layers[0].url).toBe('test.jpg');
    expect(result.current.layers[0].durationInFrames).toBe(120); // Default for non-audio
    expect(result.current.layers[0].zIndex).toBe(0); // First item
    
    // onLayersChange should be called with the new array
    expect(onLayersChange).toHaveBeenCalledWith(result.current.layers);
  });

  it('removes a layer', () => {
    const initialLayers: RemotionLayer[] = [{
      id: '1', type: 'image', url: 'test.jpg', durationInFrames: 100, zIndex: 0, x: 0, y: 0, scale: 1, opacity: 1
    }];
    
    const onLayersChange = vi.fn();
    const { result } = renderHook(() => useLayerManager(initialLayers, onLayersChange));

    act(() => {
      result.current.removeLayer('1');
    });

    expect(result.current.layers.length).toBe(0);
    expect(onLayersChange).toHaveBeenCalledWith([]);
  });

  it('updates a layer', () => {
    const initialLayers: RemotionLayer[] = [{
      id: '1', type: 'image', url: 'test.jpg', durationInFrames: 100, zIndex: 0, x: 0, y: 0, scale: 1, opacity: 1
    }];
    
    const onLayersChange = vi.fn();
    const { result } = renderHook(() => useLayerManager(initialLayers, onLayersChange));

    act(() => {
      result.current.updateLayer('1', { opacity: 0.5 });
    });

    expect(result.current.layers[0].opacity).toBe(0.5);
    expect(onLayersChange).toHaveBeenCalledWith(result.current.layers);
  });

  it('moves zIndex correctly', () => {
    const initialLayers: RemotionLayer[] = [
      { id: '1', type: 'image', url: 'test1.jpg', durationInFrames: 100, zIndex: 0, x: 0, y: 0, scale: 1, opacity: 1 },
      { id: '2', type: 'image', url: 'test2.jpg', durationInFrames: 100, zIndex: 1, x: 0, y: 0, scale: 1, opacity: 1 },
      { id: '3', type: 'image', url: 'test3.jpg', durationInFrames: 100, zIndex: 2, x: 0, y: 0, scale: 1, opacity: 1 }
    ];
    
    const onLayersChange = vi.fn();
    const { result } = renderHook(() => useLayerManager(initialLayers, onLayersChange));

    act(() => {
      // Move item 3 to zIndex 0
      result.current.moveLayerZIndex('3', 0);
    });

    const layers = result.current.layers;
    expect(layers.find(l => l.id === '3')?.zIndex).toBe(0);
    expect(layers.find(l => l.id === '1')?.zIndex).toBe(1);
    expect(layers.find(l => l.id === '2')?.zIndex).toBe(2);
    
    expect(onLayersChange).toHaveBeenCalledWith(layers);
  });
});
