import { describe, it, expect } from 'vitest';
import { WorkflowImportSchema, CreateAssetPayloadSchema, ImageInputNodeDataSchema, TextInputNodeDataSchema } from '../index';
import { validWorkflows, invalidWorkflows } from '../../test/fixtures/workflows';
import { validAssets, invalidAssets } from '../../test/fixtures/assets';
import { validNodeData, invalidNodeData } from '../../test/fixtures/nodes';

describe('Node Data Validation', () => {
  describe('Valid Node Data', () => {
    it('should validate image input node data', () => {
      const result = ImageInputNodeDataSchema.safeParse(validNodeData.imageInput);
      expect(result.success).toBe(true);
    });

    it('should validate text input node data', () => {
      const result = TextInputNodeDataSchema.safeParse(validNodeData.textInput);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Node Data', () => {
    it('should fail on missing required fields', () => {
      const result = TextInputNodeDataSchema.safeParse(invalidNodeData.missingRequired);
      expect(result.success).toBe(false);
    });

    it('should fail on wrong types', () => {
      const result = TextInputNodeDataSchema.safeParse(invalidNodeData.wrongTypes);
      expect(result.success).toBe(false);
    });
  });
});

describe('Workflow Validation', () => {
  describe('Valid Workflows', () => {
    it('should validate a simple correct workflow', () => {
      const result = WorkflowImportSchema.safeParse(validWorkflows.simple);
      expect(result.success).toBe(true);
    });

    it('should validate a complex branching workflow', () => {
      const result = WorkflowImportSchema.safeParse(validWorkflows.complex);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Workflows', () => {
    it('should fail when nodes are missing', () => {
      const result = WorkflowImportSchema.safeParse(invalidWorkflows.missingNodes);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('nodes');
      }
    });

    it('should fail with invalid edges', () => {
      const result = WorkflowImportSchema.safeParse(invalidWorkflows.invalidEdges);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['edges', 0, 'source']);
      }
    });

    it('should fail when node positions are invalid types', () => {
      const result = WorkflowImportSchema.safeParse(invalidWorkflows.invalidNodePositions);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('position');
        expect(result.error.issues[0].path).toContain('x');
      }
    });

    it('should fail on empty object', () => {
      const result = WorkflowImportSchema.safeParse(invalidWorkflows.empty);
      expect(result.success).toBe(false);
    });
  });
});

describe('Asset Validation', () => {
  describe('Valid Assets', () => {
    it('should validate a simple correct asset payload', () => {
      const result = CreateAssetPayloadSchema.safeParse(validAssets.simpleImage);
      expect(result.success).toBe(true);
    });

    it('should validate an asset with multiple images and metadata', () => {
      const result = CreateAssetPayloadSchema.safeParse(validAssets.multipleImages);
      expect(result.success).toBe(true);
    });

    it('should validate a minimal asset payload', () => {
      const result = CreateAssetPayloadSchema.safeParse(validAssets.minimal);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Assets', () => {
    it('should fail when name is missing', () => {
      const result = CreateAssetPayloadSchema.safeParse(invalidAssets.missingName);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should fail when images array is empty', () => {
      const result = CreateAssetPayloadSchema.safeParse(invalidAssets.missingImages);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('images');
      }
    });

    it('should fail when images is not an array', () => {
      const result = CreateAssetPayloadSchema.safeParse(invalidAssets.invalidImagesType);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('images');
      }
    });

    it('should fail when name exceeds maximum length', () => {
      const result = CreateAssetPayloadSchema.safeParse(invalidAssets.nameTooLong);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should fail when description exceeds maximum length', () => {
      const result = CreateAssetPayloadSchema.safeParse(invalidAssets.descriptionTooLong);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('description');
      }
    });

    // NOTE: Zod hasn't been configured with the max limits we defined in assetService yet in CreateAssetPayloadSchema.
    // Let me update CreateAssetPayloadSchema in src/schemas/asset.ts to match the ASSET_LIMITS.
  });
});
