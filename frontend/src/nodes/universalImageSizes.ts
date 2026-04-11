/** Short labels for universal aspect picker (inspector + node chrome). */
export const UNIVERSAL_ASPECT_LABELS: Record<string, string> = {
  '1:1': 'Square',
  '16:9': 'Widescreen',
  '9:16': 'Vertical',
  '4:3': 'Standard',
  '3:4': 'Portrait 4:3',
  '3:2': 'Classic photo',
  '2:3': 'Portrait photo',
};

/** Output tiers for universal image (Recraft) — longest edge scales with aspect. */
export const IMAGE_SIZE_TIERS = ['1K', '2K', '3K', '4K'] as const;
export type ImageSizeTier = (typeof IMAGE_SIZE_TIERS)[number];

const LONG_EDGE_PX: Record<ImageSizeTier, number> = {
  '1K': 1024,
  '2K': 2048,
  '3K': 3072,
  '4K': 4096,
};

export function normalizeImageSizeTier(v: unknown): ImageSizeTier {
  const s = String(v ?? '1K');
  if ((IMAGE_SIZE_TIERS as readonly string[]).includes(s)) return s as ImageSizeTier;
  return '1K';
}

/** WxH for APIs; longest side matches tier (1024 / 2048 / 3072 / 4096), preserves aspect. */
export function recraftPixelSizeForAspectAndTier(aspect: string, tier: ImageSizeTier): string {
  const parts = aspect.split(':');
  const aw = Number(parts[0]);
  const ah = Number(parts[1]);
  if (!Number.isFinite(aw) || !Number.isFinite(ah) || aw <= 0 || ah <= 0) {
    return '1024x1024';
  }
  const target = LONG_EDGE_PX[tier];
  let w: number;
  let h: number;
  if (aw >= ah) {
    w = target;
    h = Math.round((target * ah) / aw);
  } else {
    h = target;
    w = Math.round((target * aw) / ah);
  }
  w = Math.min(4096, Math.max(64, w));
  h = Math.min(4096, Math.max(64, h));
  return `${w}x${h}`;
}
