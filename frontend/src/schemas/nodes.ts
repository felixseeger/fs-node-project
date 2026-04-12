import { z } from 'zod';
import { BaseNodeDataSchema } from './workflow';

export const ImageInputNodeDataSchema = BaseNodeDataSchema.extend({
  image: z.string().nullable(),
  filename: z.string().nullable(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }).nullable().optional(),
});

export const TextInputNodeDataSchema = BaseNodeDataSchema.extend({
  text: z.string(),
  variableName: z.string().optional(),
});

export const VideoInputNodeDataSchema = BaseNodeDataSchema.extend({
  video: z.string().nullable(),
  filename: z.string().nullable(),
  duration: z.number().nullable().optional(),
});

export const AudioInputNodeDataSchema = BaseNodeDataSchema.extend({
  audioFile: z.string().nullable(),
  filename: z.string().nullable(),
});
