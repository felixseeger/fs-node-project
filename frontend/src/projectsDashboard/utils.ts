export function truncate(str: string | null | undefined, max = 40): string {
  if (str == null) return '';
  const s = String(str);
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

export function formatDate(val: unknown): string {
  if (val == null) return 'Just now';
  try {
    if (val instanceof Date) return val.toLocaleDateString();
    if (typeof val === 'number') return new Date(val).toLocaleDateString();
    if (typeof val === 'object' && val !== null && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
      return (val as { toDate: () => Date }).toDate().toLocaleDateString();
    }
    return String(val);
  } catch {
    return 'Unknown';
  }
}
