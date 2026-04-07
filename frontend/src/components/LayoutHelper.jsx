import React from 'react';

const SVGIcon = ({ children }) => (
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

const Divider = () => <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.12)', margin: '0 4px' }} />;

const ActionButton = ({ icon, onClick, title, active }) => (
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
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = active ? 'rgba(255,255,255,0.12)' : 'transparent'; e.currentTarget.style.color = active ? '#fff' : 'rgba(255,255,255,0.7)'; }}
  >
    {icon}
  </button>
);

export default function LayoutHelper({ selectedNodes, onAction, position }) {
  if (!selectedNodes || selectedNodes.length <= 1) return null;

  const style = position ? {
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
      <ActionButton title="Align Left" icon={<TextAlignLeft />} onClick={() => onAction('text_align_left')} />
      <ActionButton title="Align Center" icon={<TextAlignCenter />} onClick={() => onAction('text_align_center')} />
      <ActionButton title="Align Right" icon={<TextAlignRight />} onClick={() => onAction('text_align_right')} />
      
      <Divider />
      
      <ActionButton title="Align Nodes Left" icon={<NodeAlignLeft />} onClick={() => onAction('align_left')} />
      <ActionButton title="Align Nodes Center" icon={<NodeAlignCenter />} onClick={() => onAction('align_center')} />
      <ActionButton title="Align Nodes Right" icon={<NodeAlignRight />} onClick={() => onAction('align_right')} />
      
      <Divider />
      
      <ActionButton title="Distribute Vertically" icon={<DistributeVertical />} onClick={() => onAction('distribute_vertical')} />
      <ActionButton title="Distribute Horizontally" icon={<DistributeHorizontal />} onClick={() => onAction('distribute_horizontal')} />
      
      <Divider />
      
      <ActionButton title="Grid Nodes" icon={<GridNodes />} onClick={() => onAction('grid_nodes')} />
      <ActionButton title="Stack Nodes" icon={<StackNodes />} onClick={() => onAction('stack_nodes')} />
    </div>
  );
}
