import { z } from 'zod';
import { BaseNodeDataSchema } from './workflow';

/**
 * Validates node data against the base schema
 */
export function validateBaseNodeData(data: unknown) {
  return BaseNodeDataSchema.safeParse(data);
}

/**
 * Generic node data validator that can be extended for specific types
 */
export function validateNodeData<T extends z.ZodTypeAny>(data: unknown, schema: T) {
  return schema.safeParse(data);
}

/**
 * Example of a more specific validator for a generator node
 */
export const GeneratorNodeDataSchema = BaseNodeDataSchema.extend({
  prompt: z.string().min(1),
  model: z.string().optional(),
  aspectRatio: z.string().optional(),
  numImages: z.number().int().min(1).max(10).optional(),
});
