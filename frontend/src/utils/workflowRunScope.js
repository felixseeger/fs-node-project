/**
 * BFS along edges source → target from `startId`. Includes `startId`.
 * @param {string} startId
 * @param {Array<{ source: string, target: string }>} edges
 * @returns {Set<string>}
 */
export function collectDownstreamNodeIds(startId, edges) {
  const outgoing = new Map();
  for (const e of edges || []) {
    if (!e?.source || !e?.target) continue;
    if (!outgoing.has(e.source)) outgoing.set(e.source, []);
    outgoing.get(e.source).push(e.target);
  }
  const seen = new Set([startId]);
  const q = [startId];
  while (q.length) {
    const id = q.shift();
    const nbrs = outgoing.get(id);
    if (!nbrs) continue;
    for (const t of nbrs) {
      if (!seen.has(t)) {
        seen.add(t);
        q.push(t);
      }
    }
  }
  return seen;
}
