import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLayerManager } from '../useLayerManager';
import { RemotionLayer } from '../../types/remotion';

// Mock crypto.randomUUID for consistent testing
vi.stubGlobal('crypto', {
  randomUUID: () => 'mock-uuid-1234',
});

describe('useLayerManager', () => {
  const createMockLayer = (id: string, zIndex: number): RemotionLayer => ({
    id,
    src: 'test.jpg',
    type: 'image',
    from: 0,
    durationInFrames: 30,
    zIndex,
    status: 'idle',
    progress: 0,
    jobType: 'none',
  });

  it('should initialize with empty layers', () => {
    const { result } = renderHook(() => useLayerManager());
    expect(result.current.layers).toEqual([]);
  });

  it('should initialize with provided layers', () => {
    const initialLayers: RemotionLayer[] = [createMockLayer('1', 0)];
    const { result } = renderHook(() => useLayerManager(initialLayers));
    expect(result.current.layers).toEqual(initialLayers);
  });

  it('should add a layer', () => {
    const { result } = renderHook(() => useLayerManager());
    
    const newLayerData: Omit<RemotionLayer, 'id'> = {
      src: 'new.jpg',
      type: 'image',
      from: 0,
      durationInFrames: 60,
      zIndex: 0,
      status: 'idle',
      progress: 0,
      jobType: 'none',
    };

    act(() => {
      result.current.addLayer(newLayerData);
    });

    expect(result.current.layers).toHaveLength(1);
    expect(result.current.layers[0]).toEqual({
      ...newLayerData,
      id: 'mock-uuid-1234',
    });
  });

  it('should update a layer', () => {
    const initialLayers: RemotionLayer[] = [createMockLayer('1', 0)];
    const { result } = renderHook(() => useLayerManager(initialLayers));

    act(() => {
      result.current.updateLayer('1', { zIndex: 1, status: 'completed' });
    });

    expect(result.current.layers[0].zIndex).toBe(1);
    expect(result.current.layers[0].status).toBe('completed');
  });

  it('should remove a layer', () => {
    const initialLayers: RemotionLayer[] = [
      createMockLayer('1', 0),
      createMockLayer('2', 1),
    ];
    const { result } = renderHook(() => useLayerManager(initialLayers));

    act(() => {
      result.current.removeLayer('1');
    });

    expect(result.current.layers).toHaveLength(1);
    expect(result.current.layers[0].id).toBe('2');
  });
});
