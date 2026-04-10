/** Stable-enough client-side id for new React Flow nodes. */
export function nextId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
