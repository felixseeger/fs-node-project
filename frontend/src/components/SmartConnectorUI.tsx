import React, { useEffect, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { SmartConnectorEngine } from '../engine/SmartConnectorEngine';
import { getHandleDataType } from '../utils/handleTypes';

interface SmartConnectorUIProps {
  activeConnection: { nodeId: string; handleId: string; handleType: string } | null;
}

export const SmartConnectorUI: React.FC<SmartConnectorUIProps> = ({ activeConnection }) => {
  const { getNodes, getEdges, getInternalNode, getViewport } = useReactFlow();
  const [suggestions, setSuggestions] = useState<Array<{ x: number, y: number, score: number, label: string }>>([]);
  const [viewportTransform, setViewportTransform] = useState<string>('');

  useEffect(() => {
    if (!activeConnection) {
      setSuggestions([]);
      return;
    }

    const { nodeId, handleId } = activeConnection;
    const nodes = getNodes();
    const edges = getEdges();
    const dataType = getHandleDataType(handleId);
    const viewport = getViewport();
    setViewportTransform(`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`);

    // Get suggestions
    const suggestedNodes = SmartConnectorEngine.getSuggestions(nodeId, handleId, dataType, nodes, edges);
    
    // Convert suggested nodes to screen coordinates
    const newSuggestions: any[] = [];
    suggestedNodes.slice(0, 3).forEach(suggestion => {
      const internalNode = getInternalNode(suggestion.node.id);
      if (internalNode) {
        // Calculate rough center or handle position
        const nodeInternal: any = internalNode;
        const x = (nodeInternal.positionAbsolute?.x || suggestion.node.position.x) + (nodeInternal.measured?.width || 200) / 2;
        const y = (nodeInternal.positionAbsolute?.y || suggestion.node.position.y) + (nodeInternal.measured?.height || 100) / 2;
        
        newSuggestions.push({
          x,
          y,
          score: suggestion.score,
          label: (suggestion.node.data as any)?.label || suggestion.node.id
        });
      }
    });

    setSuggestions(newSuggestions);
  }, [activeConnection, getNodes, getEdges, getInternalNode, getViewport]);

  if (!activeConnection || suggestions.length === 0) return null;

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
      <g transform={viewportTransform}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" opacity={0.6} />
          </marker>
        </defs>
        {suggestions.map((s, i) => {
          // We'll draw a pulsating circle or a line if we have the source coord.
          // Since getting source exact screen coord is complex, we just render a highlight at the target.
          return (
            <g key={i}>
              <circle
                cx={s.x}
                cy={s.y}
                r={40}
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity={0.6}
              >
                <animate attributeName="r" from="20" to="60" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text x={s.x} y={s.y - 50} fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">
                Suggested Match ({s.score})
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
