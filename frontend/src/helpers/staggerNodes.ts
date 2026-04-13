import { type Node } from '@xyflow/react';

/**
 * Staggers a list of nodes from a base position
 */
export function staggerNodes(nodes: Node[], basePosition: { x: number, y: number }, offset = 40): Node[] {
  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: basePosition.x + (index * offset),
      y: basePosition.y + (index * offset)
    }
  }));
}
