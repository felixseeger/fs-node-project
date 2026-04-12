import { Node, Edge } from '@xyflow/react';

// Basic map of compatible types
const compatibilityMap: Record<string, string[]> = {
  image: ['image', 'any'],
  video: ['video', 'any'],
  audio: ['audio', 'any'],
  text: ['text', 'any', 'prompt'],
  any: ['image', 'video', 'audio', 'text', 'any', 'prompt'],
  prompt: ['prompt', 'text', 'any']
};

export class SmartConnectorEngine {
  /**
   * Evaluates compatibility between a source handle type and a target handle type.
   */
  static isCompatible(sourceType: string, targetType: string): boolean {
    const sType = sourceType.toLowerCase();
    const tType = targetType.toLowerCase();
    
    if (sType === tType) return true;
    
    return compatibilityMap[sType]?.includes(tType) || false;
  }

  /**
   * Recommends target nodes and handles for a given source node and handle.
   */
  static getSuggestions(
    sourceNodeId: string,
    sourceHandleId: string,
    sourceType: string,
    nodes: Node[],
    edges: Edge[]
  ) {
    const suggestions: Array<{ node: Node; handleId: string; score: number }> = [];

    // Simple heuristic: look for nodes that have target handles of compatible types,
    // and prioritize nodes that are not yet connected to this handle.
    const connectedTargetIds = edges
      .filter(e => e.source === sourceNodeId && e.sourceHandle === sourceHandleId)
      .map(e => e.target);

    nodes.forEach(node => {
      // Don't suggest connecting to self
      if (node.id === sourceNodeId) return;

      // Extract target handles from node data (assuming standard pattern)
      // Usually node.data.inputs or we just infer from nodeType
      // We'll use a rough generic approach or rely on node metadata if available
      const targetHandles = (node.data?.inputs as any[]) || [];
      
      targetHandles.forEach((handle: any) => {
        const handleType = handle.type || 'any';
        if (this.isCompatible(sourceType, handleType)) {
          let score = 10;
          
          // Penalize if already connected to this target node
          if (connectedTargetIds.includes(node.id)) {
            score -= 5;
          }
          
          suggestions.push({
            node,
            handleId: handle.id || handle.name,
            score
          });
        }
      });
    });

    return suggestions.sort((a, b) => b.score - a.score);
  }
}
