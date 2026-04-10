import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { Node } from '@xyflow/react';
import {
  calculateAspectFitSize,
  getNodeDimension,
  applyNodeDimensions,
  DEFAULT_NODE_DIMENSION,
  clearMediaDimensionsCache,
  getMediaDimensions,
  calculateConnectionPath,
} from './nodeDimensions';

describe('calculateAspectFitSize', () => {
  it('fits wide media to max width', () => {
    const r = calculateAspectFitSize(1600, 400, 800, 800);
    expect(r.width).toBe(800);
    expect(r.height).toBe(200);
  });

  it('fits tall media to max height', () => {
    const r = calculateAspectFitSize(400, 1600, 800, 800);
    expect(r.height).toBe(800);
    expect(r.width).toBe(200);
  });
});

describe('getNodeDimension', () => {
  it('prefers direct width/height on node', () => {
    const node = { width: 123, height: 45 } as Node;
    expect(getNodeDimension(node, 'width')).toBe(123);
    expect(getNodeDimension(node, 'height')).toBe(45);
  });

  it('falls back to style then measured then default', () => {
    const fromStyle = { style: { width: 99 } } as unknown as Node;
    expect(getNodeDimension(fromStyle, 'width')).toBe(99);

    const fromMeasured = { measured: { width: 77 } } as unknown as Node;
    expect(getNodeDimension(fromMeasured, 'width')).toBe(77);

    const empty = {} as Node;
    expect(getNodeDimension(empty, 'width')).toBe(DEFAULT_NODE_DIMENSION);
  });
});

describe('applyNodeDimensions', () => {
  it('merges width, height, and style', () => {
    const node = { id: '1', position: { x: 0, y: 0 }, style: { opacity: 0.5 } } as Node;
    const next = applyNodeDimensions(node, 320, 240);
    expect(next.width).toBe(320);
    expect(next.height).toBe(240);
    expect(next.style).toEqual({ opacity: 0.5, width: 320, height: 240 });
  });
});

describe('getMediaDimensions', () => {
  beforeEach(() => {
    clearMediaDimensionsCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves dimensions when Image loads', async () => {
    class MockImage {
      onload: (() => void) | null = null;
      naturalWidth = 640;
      naturalHeight = 480;
      width = 640;
      height = 480;
      crossOrigin = '';
      set src(_: string) {
        queueMicrotask(() => this.onload?.());
      }
    }
    vi.stubGlobal('Image', MockImage);

    const d = await getMediaDimensions('https://example.com/asset.png');
    expect(d.width).toBe(640);
    expect(d.height).toBe(480);
    expect(d.aspectRatio).toBeCloseTo(640 / 480, 5);
  });

  it('uses cache for same URL', async () => {
    let instances = 0;
    class MockImage {
      onload: (() => void) | null = null;
      naturalWidth = 100;
      naturalHeight = 100;
      width = 100;
      height = 100;
      set src(_: string) {
        instances += 1;
        queueMicrotask(() => this.onload?.());
      }
    }
    vi.stubGlobal('Image', MockImage);

    const url = 'https://example.com/once.png';
    await getMediaDimensions(url);
    await getMediaDimensions(url);
    expect(instances).toBe(1);
  });
});

describe('calculateConnectionPath', () => {
  it('returns an SVG path string', () => {
    const p = calculateConnectionPath(0, 0, 100, 100);
    expect(p).toMatch(/^M /);
    expect(p).toContain('C');
    expect(p).toContain('100,100');
  });
});
