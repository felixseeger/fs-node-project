import React, { useEffect, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { SmartConnectorEngine } from '../engine/SmartConnectorEngine';

interface SmartConnectorUIProps {
  activeConnection: { nodeId: string; handleId: string; handleType: string } | null;
  onAutoConnect?: (targetNodeId: string, targetHandleId: string) => void;
}

export const SmartConnectorUI: React.FC<SmartConnectorUIProps> = ({ activeConnection, onAutoConnect }) => {
  const { getNodes, getEdges, getInternalNode, getViewport } = useReactFlow();
  const [suggestions, setSuggestions] = useState<Array<{ nodeId: string, handleId: string, x: number, y: number, score: number, label: string }>>([]);
  const [viewportTransform, setViewportTransform] = useState<string>('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!activeConnection) {
      setSuggestions([]);
      return;
    }

    const { nodeId, handleId } = activeConnection;
    const nodes = getNodes();
    const edges = getEdges();
    const viewport = getViewport();
    setViewportTransform(`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`);

    // Get suggestions
    const suggestedNodes = SmartConnectorEngine.getSuggestions(nodeId, handleId, nodes, edges);
    
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
          nodeId: suggestion.node.id,
          handleId: suggestion.handleId,
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
      <g transform={viewportTransform} style={{ pointerEvents: 'all' }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" opacity={0.6} />
          </marker>
        </defs>
        {suggestions.map((s, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <g 
              key={i} 
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                e.stopPropagation();
                onAutoConnect?.(s.nodeId, s.handleId);
              }}
            >
              {/* Outer Glow */}
              <circle
                cx={s.x}
                cy={s.y}
                r={isHovered ? 55 : 45}
                fill={isHovered ? 'rgba(59, 130, 246, 0.2)' : 'transparent'}
                stroke="#3b82f6"
                strokeWidth={isHovered ? 3 : 2}
                strokeDasharray="4 4"
                style={{ transition: 'all 0.2s ease' }}
              />
              
              {/* Pulse Animation */}
              {!isHovered && (
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
              )}

              {/* Label Background */}
              <rect
                x={s.x - 70}
                y={s.y - 75}
                width={140}
                height={24}
                rx={12}
                fill={isHovered ? '#3b82f6' : '#1a1a1a'}
                stroke="#3b82f6"
                strokeWidth="1"
                style={{ transition: 'all 0.2s ease' }}
              />
              
              <text 
                x={s.x} 
                y={s.y - 58} 
                fill={isHovered ? '#fff' : '#3b82f6'} 
                fontSize="11" 
                textAnchor="middle" 
                fontWeight="bold"
                style={{ userSelect: 'none' }}
              >
                {isHovered ? 'Click to Snap' : `Match ${s.score}%`}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
