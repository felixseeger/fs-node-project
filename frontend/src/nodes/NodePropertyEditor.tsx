import React, { useState, useMemo, FC, ChangeEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { InfoIcon, PublishIcon, ChevronDownIcon } from './NodeIcons';
// @ts-ignore
import { text as textStyles, surface, border, radius, sp, font } from './nodeTokens';
import { getHandleColor, getHandleDataType } from '../utils/handleTypes';
import { Node, Edge } from '@xyflow/react';

const IMAGE_MODEL_OPTIONS = [
  'Auto',
  'Nano Banana 2',
  'recraftv4',
  'recraftv3',
  'kora',
  'flux',
  'quiver-text-to-vector',
  'remove-bg',
  'creative-upscale',
  'precision-upscale',
  'relight',
  'skin-enhancer',
  'change-camera',
  'flux-expand',
  'seedream-expand',
  'ideogram-expand',
  'style-transfer',
  'quiver-image-to-vector',
];

const VIDEO_MODEL_OPTIONS = [
  'Auto',
  'kling3',
  'runway',
  'minimax',
  'pixverse',
  'seedance',
  'wan2.6',
  'ltx-video',
];

const FRIENDLY_MODEL_LABELS: Record<string, string> = {
  'Auto': 'Auto',
  'Nano Banana 2': 'Nano Banana 2',
  'recraftv4': 'Recraft V4',
  'recraftv3': 'Recraft V3',
  'kora': 'Kora Reality',
  'flux': 'Flux',
  'quiver-text-to-vector': 'Quiver Text to Vector',
  'remove-bg': 'Remove Background',
  'creative-upscale': 'Creative Upscale',
  'precision-upscale': 'Precision Upscale',
  'relight': 'Relight',
  'skin-enhancer': 'Skin Enhancer',
  'change-camera': 'Change Camera',
  'flux-expand': 'Flux Expand',
  'seedream-expand': 'Seedream Expand',
  'ideogram-expand': 'Ideogram Expand',
  'style-transfer': 'Style Transfer',
  'quiver-image-to-vector': 'Quiver Image to Vector',
  'kling3': 'Kling 3',
  'runway': 'Runway Gen-4',
  'minimax': 'MiniMax',
  'pixverse': 'PixVerse V5',
  'seedance': 'Seedance',
  'wan2.6': 'Wan 2.6',
  'ltx-video': 'LTX Video',
};

function getModelOptionsByType(nodeType?: string) {
  if (nodeType === 'universalGeneratorImage') return IMAGE_MODEL_OPTIONS;
  if (nodeType === 'universalGeneratorVideo') return VIDEO_MODEL_OPTIONS;
  return [];
}

function getDefaultModelByType(nodeType?: string) {
  return nodeType === 'universalGeneratorVideo' ? 'kling3' : 'Nano Banana 2';
}

const styles: Record<string, React.CSSProperties> = {
  compactContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: '100%',
    padding: '20px',
    overflowY: 'auto',
    color: 'var(--color-text)',
  },
  panelContainer: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    bottom: '20px',
    width: '320px',
    backgroundColor: 'var(--color-surface)',
    backdropFilter: 'blur(20px)',
    border: '1px solid var(--color-border)',
    borderRadius: '16px',
    zIndex: 1000,
    color: 'var(--color-text)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
  },
  wrapper: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: '100%',
    overflowY: 'auto'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  titleText: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
  },
  sectionBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  labelText: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '8px'
  },
  valueText: {
    fontSize: '12px',
    color: 'var(--color-text-dim)',
    backgroundColor: 'var(--color-card)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--color-border-subtle)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  input: {
    width: '100%',
    backgroundColor: 'var(--color-input)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    color: 'var(--color-text)',
    padding: '10px 12px',
    fontSize: '12px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  row: {
    display: 'flex',
    gap: '12px'
  }
};

interface InEndPointSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const InEndPointSearch: FC<InEndPointSearchProps> = ({ value, onChange }) => (
  <div style={{ position: 'relative', marginBottom: '12px' }}>
    <input 
      style={{ ...styles.input, paddingLeft: '32px' }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search properties..."
    />
    <svg 
      style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  </div>
);

interface NodePropertyEditorProps {
  node: Node | null;
  edges?: Edge[];
  allNodes?: Node[];
  onUpdate: (id: string, data: any) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
  onOpenModelMegaMenu?: () => void;
}

const NodePropertyEditor: FC<NodePropertyEditorEditorProps> = ({
  node,
  edges = [],
  allNodes = [],
  onUpdate,
  onDelete,
  compact = false,
  onOpenModelMegaMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDataExpanded, setIsDataExpanded] = useState(true);
  const [isPointsExpanded, setIsPointsExpanded] = useState(false);
  const [isInputsExpanded, setIsInputsExpanded] = useState(true);
  const [isOutputsExpanded, setIsOutputsExpanded] = useState(true);

  const nodeMap = useMemo(() => {
    const m: Record<string, Node> = {};
    allNodes.forEach((n) => {
      m[n.id] = n;
    });
    return m;
  }, [allNodes]);

  if (!node) return null;

  const editorProps: EditorContentProps = {
    node,
    edges,
    allNodes,
    onUpdate,
    onDelete,
    searchQuery,
    setSearchQuery,
    isDataExpanded,
    setIsDataExpanded,
    isPointsExpanded,
    setIsPointsExpanded,
    isInputsExpanded,
    setIsInputsExpanded,
    isOutputsExpanded,
    setIsOutputsExpanded,
    nodeMap,
    onOpenModelMegaMenu,
  };

  if (compact) {
    return (
      <div style={styles.compactContainer}>
        <EditorContent {...editorProps} />
      </div>
    );
  }

  return createPortal(
    <div style={styles.panelContainer} className="node-property-editor">
      <div style={styles.wrapper}>
        <EditorContent {...editorProps} />
      </div>
    </div>,
    document.body
  );
};

interface EditorContentProps {
  node: Node;
  edges: Edge[];
  allNodes: Node[];
  onUpdate: (id: string, data: any) => void;
  onDelete?: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isDataExpanded: boolean;
  setIsDataExpanded: (val: boolean) => void;
  isPointsExpanded: boolean;
  setIsPointsExpanded: (val: boolean) => void;
  isInputsExpanded: boolean;
  setIsInputsExpanded: (val: boolean) => void;
  isOutputsExpanded: boolean;
  setIsOutputsExpanded: (val: boolean) => void;
  nodeMap: Record<string, Node>;
  onOpenModelMegaMenu?: () => void;
}

const EditorContent: FC<EditorContentProps> = ({
  node, edges, onUpdate,
  searchQuery, setSearchQuery,
  isDataExpanded, setIsDataExpanded,
  isPointsExpanded, setIsPointsExpanded,
  isInputsExpanded, setIsInputsExpanded,
  isOutputsExpanded, setIsOutputsExpanded,
  nodeMap,
  onOpenModelMegaMenu,
}) => {
  const isUniversalGenerator =
    node.type === 'universalGeneratorImage' || node.type === 'universalGeneratorVideo';
  const modelOptions = getModelOptionsByType(node.type);
  const currentModels = (node.data.models as string[]) || [];
  const pinnedModels = (node.data.pinnedModels as string[]) || [];
  const autoSelect = Boolean(node.data.autoSelect) || currentModels.includes('Auto');
  const useMultiple = Boolean(node.data.useMultiple);

  const applyModelPatch = (patch: any) => {
    onUpdate(node.id, patch);
  };

  const handleAutoSelectChange = (enabled: boolean) => {
    if (enabled) {
      applyModelPatch({ autoSelect: true, useMultiple: false, models: ['Auto'] });
      return;
    }
    const fallback = currentModels.find((m) => m !== 'Auto') || getDefaultModelByType(node.type);
    applyModelPatch({ autoSelect: false, models: [fallback] });
  };

  const handleUseMultipleChange = (enabled: boolean) => {
    if (enabled) {
      const withoutAuto = currentModels.filter((m) => m !== 'Auto');
      const next = withoutAuto.length > 0 ? withoutAuto : [getDefaultModelByType(node.type)];
      applyModelPatch({ useMultiple: true, autoSelect: false, models: next });
      return;
    }
    const single = currentModels.find((m) => m !== 'Auto') || getDefaultModelByType(node.type);
    applyModelPatch({ useMultiple: false, models: [single] });
  };

  const handleModelToggle = (model: string) => {
    if (autoSelect) return;
    if (!useMultiple) {
      applyModelPatch({ models: [model], autoSelect: false });
      return;
    }
    const next = currentModels.includes(model)
      ? currentModels.filter((m) => m !== model)
      : [...currentModels.filter((m) => m !== 'Auto'), model];
    const safeNext = next.length > 0 ? next : [getDefaultModelByType(node.type)];
    applyModelPatch({ models: safeNext, autoSelect: false });
  };

  const handleModelPinToggle = (model: string) => {
    const nextPinned = pinnedModels.includes(model)
      ? pinnedModels.filter((m) => m !== model)
      : [...pinnedModels, model];
    applyModelPatch({ pinnedModels: nextPinned });
  };

  const orderedModelOptions = modelOptions
    .filter((m) => m !== 'Auto')
    .sort((a, b) => {
      const aPinned = pinnedModels.includes(a) ? 1 : 0;
      const bPinned = pinnedModels.includes(b) ? 1 : 0;
      return bPinned - aPinned;
    });


  const incomingConnections = useMemo(() => {
    return edges
      .filter(e => e.target === node.id)
      .map(e => {
        const sourceNode = nodeMap[e.source];
        return {
          edgeId: e.id,
          sourceId: e.source,
          sourceLabel: (sourceNode?.data?.label as string) || sourceNode?.type || e.source,
          sourceHandle: e.sourceHandle || 'output',
          targetHandle: e.targetHandle || 'input',
          handleType: getHandleDataType(e.sourceHandle || 'output'),
          handleColor: getHandleColor(e.sourceHandle || 'output'),
        };
      });
  }, [edges, node.id, nodeMap]);

  const outgoingConnections = useMemo(() => {
    return edges
      .filter(e => e.source === node.id)
      .map(e => {
        const targetNode = nodeMap[e.target];
        return {
          edgeId: e.id,
          targetId: e.target,
          targetLabel: (targetNode?.data?.label as string) || targetNode?.type || e.target,
          sourceHandle: e.sourceHandle || 'output',
          targetHandle: e.targetHandle || 'input',
          handleType: getHandleDataType(e.targetHandle || 'input'),
          handleColor: getHandleColor(e.targetHandle || 'input'),
        };
      });
  }, [edges, node.id, nodeMap]);

  const availablePoints = Object.keys(node.data)
    .filter(key => {
      const internalKeys = [
        'label', 'onUpdate', 'onDisconnect', 'onGenerate', 'onEdit', 
        'hasConnection', 'getConnectionInfo', 'resolveInput', 'isGenerating', 
        'executionProgress', 'executionStatus', 'executionMessage', 'publishedPoints',
        'triggerGenerate', 'outputError', 'isLoading'
      ];
      return !internalKeys.includes(key);
    });

  const filteredPoints = availablePoints.filter(key => 
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header Section */}
      <div style={styles.sectionHeader}>
        <span style={styles.titleText}>Node Inspector</span>
        <InfoIcon style={{ color: '#999' }} />
      </div>

      {/* Content Section */}
      <div style={styles.sectionBody}>
          {/* Label Field */}
          <div>
            <div style={styles.labelText}>NODE LABEL</div>
            <input 
              style={styles.input}
              value={(node.data.label as string) || ''} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate(node.id, { label: e.target.value })}
              placeholder="Enter node label..."
            />
          </div>

          {/* Type Info */}
          <div style={styles.row}>
            <div>
              <div style={styles.labelText}>TYPE</div>
              <div style={styles.valueText}>{node.type}</div>
            </div>
            <div>
              <div style={styles.labelText}>STATUS</div>
              <div style={{
                ...styles.valueText,
                color: (incomingConnections.length + outgoingConnections.length) > 0 ? 'var(--color-success)' : 'var(--color-text-muted)'
              }}>
                {(incomingConnections.length + outgoingConnections.length) > 0
                  ? `${incomingConnections.length} in / ${outgoingConnections.length} out`
                  : 'Isolated'}
              </div>
            </div>
          </div>

          {/* ID Field (readonly) */}
          <div>
            <div style={styles.labelText}>UNIQUE ID</div>
            <div style={{ ...styles.valueText, fontSize: '10px', color: '#666', background: '#111', padding: '4px 8px', borderRadius: '4px', border: '1px solid #222' }}>
              {node.id}
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#3a3a3a', margin: '4px 0' }} />

          {isUniversalGenerator && (
            <div>
              {onOpenModelMegaMenu && (
                <button
                  type="button"
                  onClick={onOpenModelMegaMenu}
                  style={{
                    width: '100%',
                    marginBottom: '12px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.45)',
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#93c5fd',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Select Model…
                </button>
              )}
              <div style={{ ...styles.titleText, marginBottom: '10px' }}>MODEL SELECTION</div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={styles.labelText}>Auto select model</span>
                <input
                  type="checkbox"
                  checked={autoSelect}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleAutoSelectChange(e.target.checked)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={styles.labelText}>Use multiple models</span>
                <input
                  type="checkbox"
                  checked={useMultiple}
                  disabled={autoSelect}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleUseMultipleChange(e.target.checked)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                {orderedModelOptions.map((model) => {
                  const checked = currentModels.includes(model);
                  const pinned = pinnedModels.includes(model);
                  return (
                    <div
                      key={model}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        backgroundColor: checked ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        opacity: autoSelect ? 0.6 : 1,
                      }}
                    >
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: autoSelect ? 'not-allowed' : 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={autoSelect}
                          onChange={() => handleModelToggle(model)}
                        />
                        <span style={{ fontSize: '12px', color: '#ddd' }}>
                          {FRIENDLY_MODEL_LABELS[model] || model}
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleModelPinToggle(model)}
                        style={{
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: pinned ? 'rgba(245,158,11,0.18)' : 'transparent',
                          color: pinned ? '#f59e0b' : '#999',
                          fontSize: '10px',
                          lineHeight: 1,
                          borderRadius: '999px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                        }}
                      >
                        {pinned ? 'Pinned' : 'Pin'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Text Element Content Section (only for TextElementNode) */}
          {node.type === 'textElement' && (
            <div>
              <div
                onClick={() => setIsDataExpanded(!isDataExpanded)}
                style={{
                  ...styles.titleText,
                  marginBottom: isDataExpanded ? '10px' : '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ChevronDownIcon expanded={isDataExpanded} style={{ color: '#666' }} />
                  TEXT ELEMENT SETTINGS
                </div>
              </div>

              {isDataExpanded && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ ...styles.labelText, marginBottom: '6px' }}>
                      Base Text Color
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={(node.data.textColor as string) || '#e0e0e0'}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate(node.id, { textColor: e.target.value })}
                        style={{ width: '30px', height: '24px', padding: 0, border: '1px solid #333', background: 'transparent', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={(node.data.textColor as string) || '#e0e0e0'}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate(node.id, { textColor: e.target.value })}
                        style={{ ...styles.input, flex: 1, fontSize: '11px', padding: '4px 8px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ ...styles.labelText, marginBottom: '6px' }}>
                      Background Color
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={(node.data.bgColor as string) || '#00000000'}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate(node.id, { bgColor: e.target.value })}
                        style={{ width: '30px', height: '24px', padding: 0, border: '1px solid #333', background: 'transparent', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={(node.data.bgColor as string) || 'transparent'}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate(node.id, { bgColor: e.target.value })}
                        style={{ ...styles.input, flex: 1, fontSize: '11px', padding: '4px 8px' }}
                        placeholder="transparent or hex..."
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ ...styles.labelText, marginBottom: '6px' }}>
                      HTML Source
                    </div>
                    <textarea
                      style={{
                        ...styles.input,
                        minHeight: '100px',
                        maxHeight: '200px',
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        lineHeight: '1.4',
                        resize: 'vertical'
                      }}
                      value={(node.data.text as string) || ''}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onUpdate(node.id, { text: e.target.value })}
                      placeholder="HTML content..."
                    />
                  </div>
                  <div style={{ ...styles.labelText, marginTop: '2px', fontStyle: 'italic' }}>
                    Tip: Double-click the node on canvas for rich text editing
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Connected Inputs Section */}
          <div>
            <div
              onClick={() => setIsInputsExpanded(!isInputsExpanded)}
              style={{
                ...styles.titleText,
                marginBottom: isInputsExpanded ? '10px' : '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronDownIcon expanded={isInputsExpanded} style={{ color: '#666' }} />
                CONNECTED INPUTS
                <span style={{ fontSize: '10px', fontWeight: '400', color: '#666' }}>
                  ({incomingConnections.length})
                </span>
              </div>
            </div>

            {isInputsExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                {incomingConnections.length === 0 ? (
                  <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                    No incoming connections
                  </div>
                ) : (
                  incomingConnections.map(conn => (
                    <div key={conn.edgeId} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: conn.handleColor, flexShrink: 0
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '11px', color: '#ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conn.sourceLabel}
                        </div>
                        <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>
                          {conn.sourceHandle} → {conn.targetHandle}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '9px', color: conn.handleColor,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '2px 6px', borderRadius: '3px', flexShrink: 0
                      }}>
                        {conn.handleType}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Connected Outputs Section */}
          <div>
            <div
              onClick={() => setIsOutputsExpanded(!isOutputsExpanded)}
              style={{
                ...styles.titleText,
                marginBottom: isOutputsExpanded ? '10px' : '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronDownIcon expanded={isOutputsExpanded} style={{ color: '#666' }} />
                CONNECTED OUTPUTS
                <span style={{ fontSize: '10px', fontWeight: '400', color: '#666' }}>
                  ({outgoingConnections.length})
                </span>
              </div>
            </div>

            {isOutputsExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                {outgoingConnections.length === 0 ? (
                  <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                    No outgoing connections
                  </div>
                ) : (
                  outgoingConnections.map(conn => (
                    <div key={conn.edgeId} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: conn.handleColor, flexShrink: 0
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '11px', color: '#ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conn.targetLabel}
                        </div>
                        <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>
                          {conn.sourceHandle} → {conn.targetHandle}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '9px', color: conn.handleColor,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '2px 6px', borderRadius: '3px', flexShrink: 0
                      }}>
                        {conn.handleType}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div style={{ height: '1px', backgroundColor: '#3a3a3a', margin: '4px 0' }} />

          {/* API In-Out Points Section */}
          <div>
            <div 
              onClick={() => setIsPointsExpanded(!isPointsExpanded)}
              style={{ 
                ...styles.titleText, 
                marginBottom: isPointsExpanded ? '10px' : '0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronDownIcon expanded={isPointsExpanded} style={{ color: '#666' }} />
                API IN-OUT POINTS
                <span style={{ fontSize: '10px', fontWeight: '400', color: '#666' }}>
                  ({availablePoints.length})
                </span>
              </div>
            </div>
            
            {isPointsExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <InEndPointSearch value={searchQuery} onChange={setSearchQuery} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                  {filteredPoints.map(key => {
                    const isPublished = (node.data.publishedPoints as string[])?.includes(key);
                    const isOutput = key.startsWith('output');
                    
                    return (
                      <div key={key} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        backgroundColor: '#222',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #333'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                          <div style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%', 
                            backgroundColor: isOutput ? '#ec4899' : '#3b82f6',
                            flexShrink: 0
                          }} />
                          <span style={{ fontSize: '11px', color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={key}>{key}</span>
                        </div>
                        
                        <button 
                          onClick={() => {
                            const currentPoints = (node.data.publishedPoints as string[]) || [];
                            const newPoints = isPublished 
                              ? currentPoints.filter(p => p !== key)
                              : [...currentPoints, key];
                            onUpdate(node.id, { publishedPoints: newPoints });
                          }}
                          style={{
                            background: isPublished ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                            border: isPublished ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid #444',
                            borderRadius: '3px',
                            color: isPublished ? '#3b82f6' : '#666',
                            fontSize: '9px',
                            padding: '2px 6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            flexShrink: 0
                          }}
                        >
                          <PublishIcon active={isPublished} style={{ width: '10px', height: '10px' }} />
                          {isPublished ? 'PUBLISHED' : 'PUBLISH'}
                        </button>
                      </div>
                    );
                  })}
                  
                  {availablePoints.length === 0 && (
                    <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                      No API points available
                    </div>
                  )}

                  {availablePoints.length > 0 && filteredPoints.length === 0 && (
                    <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                      No matching results
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

      </div>
    </>
  );
};

export default NodePropertyEditor;
