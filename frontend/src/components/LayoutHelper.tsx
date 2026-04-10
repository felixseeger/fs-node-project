import React, { FC, ReactNode, CSSProperties, MouseEvent } from 'react';

/* eslint-disable react-refresh/only-export-components */

// Alignment Icons
const SVGIcon: FC<{ children: ReactNode }> = ({ children }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    {children}
  </svg>
);

const TextAlignLeft = () => <SVGIcon><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></SVGIcon>;
const TextAlignCenter = () => <SVGIcon><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></SVGIcon>;
const TextAlignRight = () => <SVGIcon><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></SVGIcon>;

const NodeAlignLeft = () => <SVGIcon><line x1="4" y1="2" x2="4" y2="22"/><rect x="8" y="6" width="12" height="4" rx="1"/><rect x="8" y="14" width="8" height="4" rx="1"/></SVGIcon>;
const NodeAlignCenter = () => <SVGIcon><line x1="12" y1="2" x2="12" y2="22"/><rect x="6" y="6" width="12" height="4" rx="1"/><rect x="8" y="14" width="8" height="4" rx="1"/></SVGIcon>;
const NodeAlignRight = () => <SVGIcon><line x1="20" y1="2" x2="20" y2="22"/><rect x="4" y="6" width="12" height="4" rx="1"/><rect x="8" y="14" width="8" height="4" rx="1"/></SVGIcon>;

const DistributeVertical = () => <SVGIcon><line x1="12" y1="2" x2="12" y2="22"/><rect x="8" y="5" width="8" height="4" rx="1"/><rect x="8" y="15" width="8" height="4" rx="1"/></SVGIcon>;
const DistributeHorizontal = () => <SVGIcon><line x1="2" y1="12" x2="22" y2="12"/><rect x="5" y="8" width="4" height="8" rx="1"/><rect x="15" y="8" width="4" height="8" rx="1"/></SVGIcon>;

const GridNodes = () => <SVGIcon><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></SVGIcon>;
const StackNodes = () => <SVGIcon><rect x="4" y="4" width="16" height="4" rx="1"/><rect x="4" y="10" width="16" height="4" rx="1"/><rect x="4" y="16" width="16" height="4" rx="1"/></SVGIcon>;

const Divider: FC = () => <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.12)', margin: '0 4px' }} />;

interface ActionButtonProps {
  icon: ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
}

const ActionButton: FC<ActionButtonProps> = ({ icon, onClick, title, active }) => (
  <button
    title={title}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    style={{
      background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
      border: 'none',
      color: active ? '#fff' : 'rgba(255,255,255,0.7)',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.1s, color 0.1s'
    }}
    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = active ? 'rgba(255,255,255,0.12)' : 'transparent'; e.currentTarget.style.color = active ? '#fff' : 'rgba(255,255,255,0.7)'; }}
  >
    {icon}
  </button>
);

interface Position {
  x: number;
  y: number;
}

interface Node {
  id: string;
  position: Position;
  width?: number;
  measured?: { width?: number; height?: number };
  height?: number;
  [key: string]: unknown;
}

interface LayoutHelperProps {
  selectedNodes: Node[];
  onAlign?: (actionId: string, nodes: Node[]) => void;
  onAction?: (actionId: string) => void;
  isVisible?: boolean;
  position?: Position;
}

export const LayoutHelper: FC<LayoutHelperProps> = ({ selectedNodes, onAlign, onAction, isVisible, position }) => {
  if (isVisible === false) return null;
  if (!selectedNodes || selectedNodes.length <= 1) return null;

  const style: CSSProperties = position ? {
    position: 'absolute',
    top: position.y,
    left: position.x,
    transform: 'translate(-50%, -50%)',
  } : {
    position: 'absolute',
    top: 24,
    left: '50%',
    transform: 'translateX(-50%)',
  };

  const handleAction = (actionId: string) => {
    if (onAction) onAction(actionId);
    if (onAlign) onAlign(actionId, selectedNodes);
  };

  return (
    <div style={{
      ...style,
      backgroundColor: 'rgba(26, 26, 26, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '10px',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      padding: '5px 6px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
    }}>
      <ActionButton title="Align Left" icon={<TextAlignLeft />} onClick={() => handleAction('text_align_left')} />
      <ActionButton title="Align Center" icon={<TextAlignCenter />} onClick={() => handleAction('text_align_center')} />
      <ActionButton title="Align Right" icon={<TextAlignRight />} onClick={() => handleAction('text_align_right')} />
      
      <Divider />
      
      <ActionButton title="Align Nodes Left" icon={<NodeAlignLeft />} onClick={() => handleAction('align_left')} />
      <ActionButton title="Align Nodes Center" icon={<NodeAlignCenter />} onClick={() => handleAction('align_center')} />
      <ActionButton title="Align Nodes Right" icon={<NodeAlignRight />} onClick={() => handleAction('align_right')} />
      
      <Divider />
      
      <ActionButton title="Distribute Vertically" icon={<DistributeVertical />} onClick={() => handleAction('distribute_vertical')} />
      <ActionButton title="Distribute Horizontally" icon={<DistributeHorizontal />} onClick={() => handleAction('distribute_horizontal')} />
      
      <Divider />
      
      <ActionButton title="Grid Nodes" icon={<GridNodes />} onClick={() => handleAction('grid_nodes')} />
      <ActionButton title="Stack Nodes" icon={<StackNodes />} onClick={() => handleAction('stack_nodes')} />
    </div>
  );
};

// Alignment helper functions
type AlignmentFunction = (nodes: Node[]) => Node[];

export const alignmentFunctions: Record<string, AlignmentFunction> = {
  align_left: (nodes: Node[]) => {
    const minX = Math.min(...nodes.map((n: Node) => n.position.x));
    return nodes.map((n: Node) => ({ ...n, position: { ...n.position, x: minX } }));
  },

  align_center_h: (nodes: Node[]) => {
    const sumX = nodes.reduce((acc: number, n: Node) => acc + n.position.x + (n.measured?.width || 200) / 2, 0);
    const avgX = sumX / nodes.length;
    return nodes.map((n: Node) => ({
      ...n,
      position: { ...n.position, x: avgX - (n.measured?.width || 200) / 2 }
    }));
  },

  align_right: (nodes: Node[]) => {
    const maxX = Math.max(...nodes.map((n: Node) => n.position.x + (n.measured?.width || 200)));
    return nodes.map((n: Node) => ({
      ...n,
      position: { ...n.position, x: maxX - (n.measured?.width || 200) }
    }));
  },

  align_top: (nodes: Node[]) => {
    const minY = Math.min(...nodes.map((n: Node) => n.position.y));
    return nodes.map((n: Node) => ({ ...n, position: { ...n.position, y: minY } }));
  },

  align_center_v: (nodes: Node[]) => {
    const sumY = nodes.reduce((acc: number, n: Node) => acc + n.position.y + (n.measured?.height || 100) / 2, 0);
    const avgY = sumY / nodes.length;
    return nodes.map((n: Node) => ({
      ...n,
      position: { ...n.position, y: avgY - (n.measured?.height || 100) / 2 }
    }));
  },

  align_bottom: (nodes: Node[]) => {
    const maxY = Math.max(...nodes.map((n: Node) => n.position.y + (n.measured?.height || 100)));
    return nodes.map((n: Node) => ({
      ...n,
      position: { ...n.position, y: maxY - (n.measured?.height || 100) }
    }));
  },

  distribute_h: (nodes: Node[]) => {
    const sorted = [...nodes].sort((a: Node, b: Node) => a.position.x - b.position.x);
    if (sorted.length < 2) return sorted;
    const minX = sorted[0].position.x;
    const maxX = sorted[sorted.length - 1].position.x + (sorted[sorted.length - 1].measured?.width || 200);
    const totalWidth = maxX - minX;
    const spacing = totalWidth / (sorted.length - 1);

    return sorted.map((n: Node, i: number) => ({
      ...n,
      position: { ...n.position, x: minX + spacing * i - (n.measured?.width || 200) / 2 }
    }));
  },

  distribute_v: (nodes: Node[]) => {
    const sorted = [...nodes].sort((a: Node, b: Node) => a.position.y - b.position.y);
    if (sorted.length < 2) return sorted;
    const minY = sorted[0].position.y;
    const maxY = sorted[sorted.length - 1].position.y + (sorted[sorted.length - 1].measured?.height || 100);
    const totalHeight = maxY - minY;
    const spacing = totalHeight / (sorted.length - 1);

    return sorted.map((n: Node, i: number) => ({
      ...n,
      position: { ...n.position, y: minY + spacing * i - (n.measured?.height || 100) / 2 }
    }));
  },
};

export default LayoutHelper;
