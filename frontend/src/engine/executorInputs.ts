/**
 * Normalize upstream node outputs (objects) vs plain strings for executors.
 * resolveInputs assigns the full source output object per target handle.
 */

export function isProbablyImageUrl(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  if (t.startsWith('data:image')) return true;
  return t.startsWith('http://') || t.startsWith('https://');
}

function pushUrl(out: string[], s: unknown): void {
  if (typeof s === 'string' && isProbablyImageUrl(s)) out.push(s.trim());
}

/**
 * Collect image URLs from an upstream value (input node output, generator output, etc.).
 */
export function collectImageUrls(value: unknown): string[] {
  const out: string[] = [];
  if (value == null) return out;
  if (typeof value === 'string') {
    pushUrl(out, value);
    return out;
  }
  if (typeof value !== 'object') return out;

  const o = value as Record<string, unknown>;
  pushUrl(out, o.outputImage);
  pushUrl(out, o.image);
  pushUrl(out, o.url);
  pushUrl(out, o.output);

  const fv = o.fieldValues as Record<string, unknown> | undefined;
  if (fv) {
    pushUrl(out, fv.image);
    if (Array.isArray(fv.images)) fv.images.forEach((x) => pushUrl(out, x));
  }

  const ibf = o.imagesByField as Record<string, unknown> | undefined;
  if (ibf) {
    for (const v of Object.values(ibf)) {
      if (Array.isArray(v)) v.forEach((x) => pushUrl(out, x));
      else pushUrl(out, v);
    }
  }

  const imgs = o.images;
  if (Array.isArray(imgs)) imgs.forEach((x) => pushUrl(out, x));

  return [...new Set(out)];
}

export function extractPrimaryImageUrl(value: unknown): string | undefined {
  return collectImageUrls(value)[0];
}

/**
 * Best-effort prompt text from connected upstream (input bundle, analyzer, improve prompt, etc.).
 */
export function extractPromptFromUpstream(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    const t = value.trim();
    return t || fallback;
  }
  if (typeof value !== 'object') return fallback;

  const o = value as Record<string, unknown>;
  const fv = o.fieldValues as Record<string, unknown> | undefined;

  const candidates: unknown[] = [
    o.analysisResult,
    o.outputPrompt,
    o.outputText,
    o.text,
    o.prompt,
    fv?.prompt,
    fv?.text,
  ];

  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return fallback;
}
