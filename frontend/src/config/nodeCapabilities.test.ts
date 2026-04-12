import { describe, it, expect } from 'vitest';
import { getCapabilitiesForType, getNodeTypesForCapability } from './nodeCapabilities';
import { NodeCapabilities } from '../nodes/nodeCapabilities';

describe('Node Capabilities System', () => {
  it('should return correct capabilities for known node types', () => {
    const generatorCaps = getCapabilitiesForType('generator');
    expect(generatorCaps).toContain(NodeCapabilities.IMAGE_GENERATE);

    const universalImageCaps = getCapabilitiesForType('universalGeneratorImage');
    expect(universalImageCaps).toContain(NodeCapabilities.IMAGE_GENERATE);
    expect(universalImageCaps).toContain(NodeCapabilities.IMAGE_EDIT);
    expect(universalImageCaps).toContain(NodeCapabilities.IMAGE_UPSCALE);
    expect(universalImageCaps).toContain(NodeCapabilities.IMAGE_EXPAND);
    
    const routerCaps = getCapabilitiesForType('routerNode');
    expect(routerCaps).toEqual([NodeCapabilities.UTILITY_ROUTER]);
  });

  it('should return empty array for unknown node types', () => {
    const unknownCaps = getCapabilitiesForType('someUnknownNodeType');
    expect(unknownCaps).toEqual([]);
  });

  it('should return node types for a specific capability', () => {
    const imageInputNodes = getNodeTypesForCapability(NodeCapabilities.INPUT_MEDIA);
    expect(imageInputNodes).toContain('input');
    expect(imageInputNodes).toContain('imageNode');
    expect(imageInputNodes).toContain('assetNode');
    expect(imageInputNodes).toContain('sourceMediaNode');
    
    const upscaleNodes = getNodeTypesForCapability(NodeCapabilities.IMAGE_UPSCALE);
    expect(upscaleNodes).toContain('universalGeneratorImage');
    expect(upscaleNodes).toContain('creativeUpscale');
    expect(upscaleNodes).toContain('precisionUpscale');
  });

  it('should return empty array if no node has the capability', () => {
    // A completely made up capability
    const emptyNodes = getNodeTypesForCapability('non_existent_capability' as any);
    expect(emptyNodes).toEqual([]);
  });
});
