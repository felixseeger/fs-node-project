import { z } from 'zod';

export const NodeStatusSchema = z.enum([
  'idle', 'pending', 'running', 'completed', 'failed', 
  'cancelled', 'skipped', 'loading', 'complete', 'error', 'paused'
]);

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const BaseNodeDataSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: NodeStatusSchema.optional(),
  error: z.string().nullable().optional(),
  progress: z.number().min(0).max(100).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  _settingsPanelHeight: z.number().optional(),
  executionStatus: NodeStatusSchema.optional(),
  executionProgress: z.number().optional(),
  executionMessage: z.string().optional(),
  executionError: z.string().optional(),
}).passthrough();

export const NodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: PositionSchema,
  data: BaseNodeDataSchema,
  measured: z.object({
    width: z.number(),
    height: z.number(),
  }).optional(),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
  parentId: z.string().optional(),
}).passthrough();

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  type: z.string().optional(),
  animated: z.boolean().optional(),
  selected: z.boolean().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export const WorkflowImportSchema = z.object({
  name: z.string().optional(),
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});

export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
  thumbnail: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  isPublic: z.boolean().optional(),
  authorName: z.string().nullable().optional(),
  sharedWith: z.array(z.string()).optional(),
  userId: z.string().optional(),
}).passthrough();
