import { useState, useCallback, useEffect } from 'react';
import NodePropertyEditor from './nodes/NodePropertyEditor';
import MegaMenuModelSearch from './components/MegaMenuModelSearch';

/**
 * InspectorPanel - Right-edge panel on the canvas when exactly one node is selected.
 * Hidden when nothing or multiple nodes are selected (no empty chrome).
 * - Closed: thin vertical icon tab
 * - Open: 320px Node Inspector (NodePropertyEditor)
 */

type ModelMegaMenuKind = 'image' | 'video';

interface InspectorPanelProps {
  nodes?: any[];
  edges?: any[];
  onUpdateNodeData?: (nodeId: string, patch: any) => void;
  onDeleteNode?: (nodeId: string) => void;
  onRunNode?: (nodeId: string) => void;
  isRunning?: boolean;
  locks?: any[];
  currentUserId?: string;
}

export default function InspectorPanel({
  nodes = [],
  edges = [],
  onUpdateNodeData,
  onDeleteNode,
  onRunNode,
  isRunning = false,
  locks = [],
  currentUserId,
}: InspectorPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [modelMegaMenuOpen, setModelMegaMenuOpen] = useState(false);

  const selectedNodes = nodes.filter((n) => n.selected);
  const singleSelected = selectedNodes.length === 1 ? selectedNodes[0] : null;

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setModelMegaMenuOpen(false);
  }, [singleSelected?.id]);

  const handleInspectorMegaMenuSelect = useCallback(
    (kind: ModelMegaMenuKind, modelKey: string) => {
      if (!singleSelected || !onUpdateNodeData) return;
      if (kind === 'image' && singleSelected.type === 'universalGeneratorImage') {
        onUpdateNodeData(singleSelected.id, {
          models: [modelKey],
          autoSelect: false,
          useMultiple: false,
        });
      } else if (kind === 'video' && singleSelected.type === 'universalGeneratorVideo') {
        onUpdateNodeData(singleSelected.id, {
          models: [modelKey],
          autoSelect: false,
          useMultiple: false,
        });
      }
    },
    [singleSelected, onUpdateNodeData]
  );

  const openModelMegaMenu =
    singleSelected &&
    (singleSelected.type === 'universalGeneratorImage' ||
      singleSelected.type === 'universalGeneratorVideo')
      ? () => setModelMegaMenuOpen(true)
      : undefined;

  const lockInfo = singleSelected 
    ? locks.find((l: any) => l.id === singleSelected.id && l.userId !== currentUserId)
    : null;
  const isLockedByOther = !!lockInfo;

  if (!singleSelected) {
    return <style>{inspectorStyles}</style>;
  }

  return (
    <>
      <style>{inspectorStyles}</style>

      <MegaMenuModelSearch
        open={modelMegaMenuOpen}
        onClose={() => setModelMegaMenuOpen(false)}
        onSelect={handleInspectorMegaMenuSelect}
      />

      <button
        className="inspector-toggle"
        onClick={handleToggle}
        title={isOpen ? 'Close Inspector' : 'Open Inspector'}
        aria-label={isOpen ? 'Close Inspector' : 'Open Inspector'}
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="inspector-panel">
          <NodePropertyEditor
            node={singleSelected as any}
            edges={edges as any}
            allNodes={nodes as any}
            onUpdate={onUpdateNodeData}
            onDelete={onDeleteNode}
            compact
            onOpenModelMegaMenu={openModelMegaMenu}
            onRunNode={onRunNode ? () => onRunNode(singleSelected.id) : undefined}
            isRunning={isRunning}
            readOnly={isLockedByOther}
            lockInfo={lockInfo}
          />
        </div>
      )}
    </>
  );
}

const inspectorStyles = `
  /* ────────────────────────────────────────────────────
     Inspector Toggle Tab
     ──────────────────────────────────────────────────── */
  .inspector-toggle {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1500;
    width: 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(30, 30, 35, 0.9);
    border: 1px solid #3a3a3a;
    border-right: none;
    border-radius: 8px 0 0 8px;
    color: #888;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
  }

  .inspector-toggle:hover {
    background: rgba(40, 40, 50, 0.95);
    color: #ccc;
    width: 28px;
  }

  /* ────────────────────────────────────────────────────
     Inspector Panel
     ──────────────────────────────────────────────────── */
  .inspector-panel {
    position: absolute;
    top: 16px;
    right: 16px;
    max-height: calc(100% - 32px);
    width: 320px;
    z-index: 1400;
    background: rgba(18, 18, 24, 0.92);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    box-shadow: -8px 0 32px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: inspectorSlideIn 0.25s ease-out;
  }

  @keyframes inspectorSlideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
