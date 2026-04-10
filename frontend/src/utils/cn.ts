/**
 * Class Name Utility
 *
 * Combines string fragments and optional object maps `{ "class": condition }`
 * into a single space-separated class string.
 */

export type CnInput =
  | string
  | boolean
  | undefined
  | null
  | Record<string, boolean | undefined | null>;

export function cn(...classes: CnInput[]): string {
  const parts: string[] = [];
  for (const c of classes) {
    if (c == null || c === false) continue;
    if (typeof c === 'string') {
      if (c.length > 0) parts.push(c);
      continue;
    }
    if (typeof c === 'object' && !Array.isArray(c)) {
      for (const [key, val] of Object.entries(c)) {
        if (val) parts.push(key);
      }
    }
  }
  return parts.join(' ');
}
