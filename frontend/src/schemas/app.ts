import { z } from 'zod';

export const AppThemeSchema = z.enum(['light', 'dark']).default('dark');

export const CanvasZoomModeSchema = z.enum(['scroll', 'altScroll', 'ctrlScroll']).default('ctrlScroll');

export const AppSettingsSchema = z.object({
  theme: AppThemeSchema,
  zoomMode: CanvasZoomModeSchema,
});
