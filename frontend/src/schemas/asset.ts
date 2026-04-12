import { z } from 'zod';

export const AssetStatusSchema = z.enum(['draft', 'processing', 'ready', 'error', 'archived']);

export const AssetMediaTypeSchema = z.enum(['image', 'video', 'audio', 'document']);

export const AssetMediaItemSchema = z.object({
  id: z.string(),
  url: z.string().url().or(z.string().startsWith('data:')),
  type: AssetMediaTypeSchema,
  filename: z.string(),
  mimeType: z.string(),
  size: z.number().optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }).optional(),
  duration: z.number().optional(),
  thumbnail: z.string().optional(),
  createdAt: z.string(),
});

export const AssetSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  userId: z.string(),
  images: z.array(z.string()),
  mediaItems: z.array(AssetMediaItemSchema).optional(),
  status: AssetStatusSchema,
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const CreateAssetPayloadSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  images: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateAssetPayloadSchema = CreateAssetPayloadSchema.partial().extend({
  status: AssetStatusSchema.optional(),
});
