import React, { useState, useMemo, useCallback, FC, ChangeEvent } from 'react';
import { Node, Edge } from '@xyflow/react';
import { getHandleDataType, getHandleColor } from './utils/handleTypes';

const ASPECT_OPTIONS = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'];
const RESOLUTION_OPTIONS = ['512', '768', '1024', '1280', '1536', '2048'];

interface InputPoint {
  nodeId: string;
  nodeLabel: string;
  nodeType?: string;
  pointKey: string;
  handleDataType: string;
  handleColor: string;
  currentValue: any;
  isConnected: boolean;
}

interface InputFieldProps {
  point: InputPoint;
  value: any;
  onChange: (value: any) => void;
}

const InputField: FC<InputFieldProps> = ({ point, value, onChange }) => {
  const { handleDataType, pointKey } = point;

  if (handleDataType === 'text') {
    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      if (text.length > 5000) {
        console.warn('Input text exceeds maximum length of 5000 characters');
        return;
      }
      onChange(text);
    };

    return (
      <textarea
        value={value || ''}
        onChange={handleTextChange}
        placeholder={`Enter ${pointKey}...`}
        rows={3}
        style={fieldStyles.textarea}
        maxLength={5000}
      />
    );
  }

  if (handleDataType === 'image') {
    return (
      <div style={fieldStyles.dropZone}>
        {value ? (
          <div style={{ position: 'relative' }}>
            <img src={value} alt="" style={fieldStyles.preview} />
            <button onClick={() => onChange(null)} style={fieldStyles.removeBtn}>×</button>
          </div>
        ) : (
          <label style={fieldStyles.uploadLabel}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                if (!file.type.startsWith('image/')) {
                  console.warn('Invalid file type. Only images are accepted.');
                  return;
                }
                
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                  console.warn('File size exceeds 10MB limit');
                  return;
                }
                
                const reader = new FileReader();
                reader.onload = (ev) => {
                  if (ev.target?.result) {
                    onChange(ev.target.result);
                  }
                };
                reader.onerror = (error) => {
                  console.error('Error reading file:', error);
                };
                reader.readAsDataURL(file);
              }}
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>Click to upload image</span>
          </label>
        )}
      </div>
    );
  }

  if (handleDataType === 'video' || handleDataType === 'audio') {
    const accept = handleDataType === 'video' ? 'video/*' : 'audio/*';
    return (
      <div style={fieldStyles.dropZone}>
        {value ? (
          <div style={{ position: 'relative', width: '100%' }}>
            {handleDataType === 'video' ? (
              <video src={value} controls style={{ width: '100%', borderRadius: 6 }} />
            ) : (
              <audio src={value} controls style={{ width: '100%' }} />
            )}
            <button onClick={() => onChange(null)} style={fieldStyles.removeBtn}>×</button>
          </div>
        ) : (
          <label style={fieldStyles.uploadLabel}>
            <input
              type="file"
              accept={accept}
              style={{ display: 'none' }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                onChange(url);
              }}
            />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Click to upload {handleDataType}</span>
          </label>
        )}
      </div>
    );
  }

  if (handleDataType === 'aspect_ratio') {
    return (
      <select value={value || '1:1'} onChange={(e) => onChange(e.target.value)} style={fieldStyles.select}>
        {ASPECT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }

  if (handleDataType === 'resolution') {
    return (
      <select value={value || '1024'} onChange={(e) => onChange(e.target.value)} style={fieldStyles.select}>
        {RESOLUTION_OPTIONS.map(o => <option key={o} value={o}>{o}px</option>)}
      </select>
    );
  }

  if (handleDataType === 'num_images') {
    return (
      <input
        type="number"
        min={1}
        max={10}
        value={value || 1}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 1)}
        style={fieldStyles.numberInput}
      />
    );
  }

  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${pointKey}...`}
      style={fieldStyles.textInput}
    />
  );
};

interface OutputDisplayProps {
  point: InputPoint;
  node: Node;
}

const OutputDisplay: FC<OutputDisplayProps> = ({ point, node }) => {
  const { handleDataType, pointKey } = point;
  const val = (node.data as any)?.[pointKey];
  const progress = (node.data as any)?.executionProgress;
  const isLoading = (node.data as any)?.isGenerating || (node.data as any)?.isLoading;

  if (isLoading) {
    return (
      <div style={fieldStyles.outputPlaceholder}>
        <div style={fieldStyles.spinner} />
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>
          {progress ? `${Math.round(progress * 100)}%` : 'Processing...'}
        </span>
        {progress != null && (
          <div style={fieldStyles.progressTrack}>
            <div style={{ ...fieldStyles.progressFill, width: `${Math.round(progress * 100)}%` }} />
          </div>
        )}
      </div>
    );
  }

  if (!val) {
    return (
      <div style={fieldStyles.outputPlaceholder}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Will appear when workflow runs</span>
      </div>
    );
  }

  if (handleDataType === 'image') {
    const imgs = Array.isArray(val) ? val : [val];
    const filenameBase = `${point.nodeLabel.toLowerCase().replace(/\s+/g, '-')}-${point.pointKey.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {imgs.map((src, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <img src={src} alt="" style={fieldStyles.outputImage} />
            <button 
              onClick={(e) => {
                e.preventDefault();
                const a = document.createElement('a');
                a.href = src;
                a.download = `${filenameBase}-${i + 1}-${Date.now()}.jpg`;
                a.click();
              }}
              style={{ ...fieldStyles.downloadBtn, border: 'none', cursor: 'pointer' }} 
              title="Download"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (handleDataType === 'video') {
    return (
      <div style={{ position: 'relative' }}>
        <video src={val} controls style={{ width: '100%', borderRadius: 6 }} />
        <button 
          onClick={(e) => {
            e.preventDefault();
            const a = document.createElement('a');
            a.href = val;
            const filename = `${point.nodeLabel.toLowerCase().replace(/\s+/g, '-')}-${point.pointKey.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.mp4`;
            a.download = filename;
            a.click();
          }}
          style={{ ...fieldStyles.downloadBtn, border: 'none', cursor: 'pointer' }} 
          title="Download"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    );
  }

  if (handleDataType === 'audio') {
    return <audio src={val} controls style={{ width: '100%' }} />;
  }

  if (handleDataType === 'text') {
    return (
      <div style={fieldStyles.outputText}>
        {typeof val === 'string' ? val : JSON.stringify(val, null, 2)}
      </div>
    );
  }

  return (
    <div style={fieldStyles.badge}>
      {typeof val === 'string' ? val : JSON.stringify(val)}
    </div>
  );
};

interface WorkflowInterfaceProps {
  nodes: Node[];
  edges: Edge[];
  onUpdateNodeData: (id: string, data: any) => void;
  onRunWorkflow: () => Promise<void>;
  onSwitchToEditor: () => void;
  isRunning: boolean;
}

export const WorkflowInterface: FC<WorkflowInterfaceProps> = ({
  nodes,
  edges,
  onUpdateNodeData,
  onRunWorkflow,
  onSwitchToEditor,
  isRunning,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleRunWorkflowSafe = useCallback(async () => {
    if (isSubmitting || isRunning) {
      console.warn('Workflow execution already in progress');
      return;
    }
    
    if (!nodes || nodes.length === 0) {
      console.warn('Cannot run workflow: no nodes present');
      return;
    }
    
    const hasGenerators = nodes.some(node => 
      node.type && (node.type.includes('Generator') || node.type.includes('Node'))
    );
    
    if (!hasGenerators) {
      console.warn('Cannot run workflow: no generator nodes found');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onRunWorkflow();
    } catch (error) {
      console.error('Workflow execution failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, isRunning, nodes, onRunWorkflow]);

  const { inputPoints, outputPoints } = useMemo(() => {
    const inp: InputPoint[] = [];
    const out: InputPoint[] = [];
    for (const node of nodes) {
      const published = (node.data as any)?.publishedPoints as string[];
      if (!published || published.length === 0) continue;
      for (const key of published) {
        const handleDataType = getHandleDataType(key);
        const handleColor = getHandleColor(key);
        const isOutput = key.startsWith('output');
        const hasIncomingEdge = edges.some(e => e.target === node.id && e.targetHandle === key);
        const entry: InputPoint = {
          nodeId: node.id,
          nodeLabel: (node.data as any)?.label as string || node.type || '',
          nodeType: node.type,
          pointKey: key,
          handleDataType,
          handleColor,
          currentValue: (node.data as any)?.[key],
          isConnected: hasIncomingEdge,
        };
        if (isOutput) out.push(entry);
        else inp.push(entry);
      }
    }
    return { inputPoints: inp, outputPoints: out };
  }, [nodes, edges]);

  const isEmpty = inputPoints.length === 0 && outputPoints.length === 0;

  return (
    <div style={styles.root}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <div style={styles.modeBadge}>INTERFACE MODE</div>
          <span style={styles.topBarTitle}>Workflow Interface</span>
        </div>
        <button onClick={onSwitchToEditor} style={styles.editorBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
          Editor Mode
        </button>
      </div>

      {isEmpty ? (
        <div style={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
          <p style={{ fontSize: 16, color: 'var(--color-text-muted)', marginTop: 16 }}>No API points published</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', maxWidth: 360, lineHeight: 1.5 }}>
            Select nodes in the Editor and publish points in the Node Inspector to expose them here.
          </p>
          <button onClick={onSwitchToEditor} style={{ ...styles.editorBtn, marginTop: 16 }}>
            Go to Editor
          </button>
        </div>
      ) : (
        <div style={styles.content} className="workflow-interface-content">
          {/* Inputs Column */}
          <div style={styles.column} className="workflow-interface-column">
            <div style={styles.columnHeader}>
              <span style={styles.columnTitle}>INPUTS</span>
              <span style={styles.countBadge}>{inputPoints.length}</span>
            </div>
            <div style={styles.cardList}>
              {inputPoints.length === 0 ? (
                <div style={styles.colEmpty}>No input points published</div>
              ) : (
                inputPoints.map((pt) => (
                  <div key={`${pt.nodeId}-${pt.pointKey}`} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div style={{ ...styles.dot, backgroundColor: pt.handleColor }} />
                      <span style={styles.cardNodeLabel}>{pt.nodeLabel}</span>
                      <span style={styles.typeBadge}>{pt.handleDataType}</span>
                    </div>
                    <div style={styles.cardKey}>{pt.pointKey}</div>
                    {pt.isConnected ? (
                      <div style={styles.connectedBadge}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        Connected from upstream
                      </div>
                    ) : (
                      <InputField
                        point={pt}
                        value={pt.currentValue}
                        onChange={(val) => onUpdateNodeData(pt.nodeId, { [pt.pointKey]: val })}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
            {inputPoints.length > 0 && (
              <button
                onClick={handleRunWorkflowSafe}
                disabled={isRunning || isSubmitting}
                style={{
                  ...styles.runBtn,
                  opacity: isRunning || isSubmitting ? 0.5 : 1,
                  cursor: isRunning || isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isRunning || isSubmitting ? (
                  <>
                    <div style={{ ...fieldStyles.spinner, width: 14, height: 14, borderWidth: 2 }} />
                    {isRunning ? 'Running...' : 'Preparing...'}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Run Workflow
                  </>
                )}
              </button>
            )}
          </div>

          {/* Divider */}
          <div style={styles.divider} className="workflow-interface-divider" />

          {/* Outputs Column */}
          <div style={styles.column} className="workflow-interface-column">
            <div style={styles.columnHeader}>
              <span style={styles.columnTitle}>OUTPUTS</span>
              <span style={styles.countBadge}>{outputPoints.length}</span>
            </div>
            <div style={styles.cardList}>
              {outputPoints.length === 0 ? (
                <div style={styles.colEmpty}>No output points published</div>
              ) : (
                outputPoints.map((pt) => {
                  const node = nodes.find(n => n.id === pt.nodeId);
                  return (
                    <div key={`${pt.nodeId}-${pt.pointKey}`} style={styles.card}>
                      <div style={styles.cardHeader}>
                        <div style={{ ...styles.dot, backgroundColor: pt.handleColor }} />
                        <span style={styles.cardNodeLabel}>{pt.nodeLabel}</span>
                        <span style={styles.typeBadge}>{pt.handleDataType}</span>
                      </div>
                      <div style={styles.cardKey}>{pt.pointKey}</div>
                      {node && <OutputDisplay point={pt} node={node} />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'var(--color-bg)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    overflow: 'hidden',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    flexShrink: 0,
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  modeBadge: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--color-brand-cyan)',
    backgroundColor: 'rgba(94,231,223,0.1)',
    border: '1px solid rgba(94,231,223,0.2)',
    padding: '3px 8px',
    borderRadius: 4,
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  editorBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--color-text-dim)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    cursor: 'pointer',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    padding: 24,
    gap: 0,
  },
  column: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  columnTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
  },
  countBadge: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: '1px 6px',
    borderRadius: 8,
  },
  cardList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingRight: 8,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  cardNodeLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--color-text-dim)',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  typeBadge: {
    fontSize: 9,
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: '2px 6px',
    borderRadius: 3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    flexShrink: 0,
  },
  cardKey: {
    fontSize: 10,
    color: 'var(--color-text-muted)',
    fontFamily: 'monospace',
  },
  connectedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 10,
    color: 'var(--color-brand-cyan)',
    backgroundColor: 'rgba(94,231,223,0.08)',
    border: '1px solid rgba(94,231,223,0.15)',
    padding: '6px 10px',
    borderRadius: 6,
  },
  colEmpty: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 32,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    margin: '0 24px',
    flexShrink: 0,
  },
  runBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    padding: '12px 24px',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--color-bg)',
    backgroundColor: 'var(--color-brand-cyan)',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    flexShrink: 0,
  },
};

const fieldStyles: Record<string, React.CSSProperties> = {
  textarea: {
    width: '100%',
    minHeight: 72,
    padding: '10px 12px',
    fontSize: 12,
    color: 'var(--color-text)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    resize: 'vertical',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textInput: {
    width: '100%',
    padding: '8px 12px',
    fontSize: 12,
    color: 'var(--color-text)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    outline: 'none',
    boxSizing: 'border-box',
  },
  numberInput: {
    width: 80,
    padding: '8px 12px',
    fontSize: 12,
    color: 'var(--color-text)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    fontSize: 12,
    color: 'var(--color-text)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    outline: 'none',
  },
  dropZone: {
    width: '100%',
    minHeight: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    border: '1px dashed rgba(255,255,255,0.12)',
    borderRadius: 8,
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 16,
    width: '100%',
    height: '100%',
  },
  preview: {
    maxWidth: '100%',
    maxHeight: 200,
    borderRadius: 6,
    display: 'block',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'var(--color-text)',
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  outputPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.04)',
  },
  spinner: {
    width: 20,
    height: 20,
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: 'var(--color-brand-cyan)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  progressTrack: {
    width: '80%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--color-brand-cyan)',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
  outputImage: {
    width: '100%',
    borderRadius: 6,
    display: 'block',
  },
  outputText: {
    fontSize: 12,
    color: 'var(--color-text-dim)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '10px 12px',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.06)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxHeight: 200,
    overflowY: 'auto',
  },
  downloadBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text)',
    textDecoration: 'none',
  },
  badge: {
    fontSize: 12,
    color: 'var(--color-text-dim)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: '6px 10px',
    borderRadius: 6,
    display: 'inline-block',
  },
};

export default WorkflowInterface;
