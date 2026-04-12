/* eslint-disable react-compiler/react-compiler */
import React, { useEffect, useMemo, useRef, useState, type FC, type ChangeEvent } from 'react';
import { type Node, type Edge } from '@xyflow/react';

interface IOPoint {
  id: string;
  label: string;
  nodeId: string;
  handleId: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  inputs: IOPoint[];
  outputs: IOPoint[];
}

interface TemplateBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNodes?: Node[];
  nodes?: Node[];
  edges?: Edge[];
  onCreated?: (data: { template: Template; placeOnCanvas: boolean }) => void;
}

interface IOCandidate {
  id: string;
  nodeId: string;
  handleId: string;
  nodeLabel: string;
  defaultLabel: string;
}

interface IOStateEntry {
  include: boolean;
  label: string;
}

interface IOState {
  [key: string]: IOStateEntry;
}

/**
 * TemplateBuilderModal
 *
 * Packages the current selection (or, when nothing is selected, the entire
 * canvas) into a reusable Workflow Template. The user picks which boundary
 * handles become external Inputs and which become external Outputs, names
 * the template, and saves.
 */
export const TemplateBuilderModal: FC<TemplateBuilderModalProps> = ({
  isOpen,
  onClose,
  selectedNodes = [],
  nodes = [],
  edges = [],
  onCreated,
}) => {
  const scopeNodes = selectedNodes.length > 0 ? selectedNodes : nodes;
  const scopeIdsKey = scopeNodes.map((n) => n.id).sort().join('|');
  const scopeIds = useMemo(() => new Set(scopeIdsKey ? scopeIdsKey.split('|') : []), [scopeIdsKey]);

  const { candidateInputs, candidateOutputs, internalEdges } = useMemo(() => {
    const ins = new Map<string, IOCandidate>();
    const outs = new Map<string, IOCandidate>();
    const inner: Edge[] = [];
    
    edges.forEach((e) => {
      const sIn = scopeIds.has(e.source);
      const tIn = scopeIds.has(e.target);
      
      if (sIn && tIn) {
        inner.push(e);
      } else if (tIn && !sIn) {
        const key = `${e.target}::${e.targetHandle || 'in'}`;
        if (!ins.has(key)) {
          const node = scopeNodes.find((n) => n.id === e.target);
          const label = node?.data?.label as string || node?.type || e.target;
          ins.set(key, {
            id: key,
            nodeId: e.target,
            handleId: e.targetHandle || 'in',
            nodeLabel: label,
            defaultLabel: `${label} ${e.targetHandle || 'in'}`,
          });
        }
      } else if (sIn && !tIn) {
        const key = `${e.source}::${e.sourceHandle || 'out'}`;
        if (!outs.has(key)) {
          const node = scopeNodes.find((n) => n.id === e.source);
          const label = node?.data?.label as string || node?.type || e.source;
          outs.set(key, {
            id: key,
            nodeId: e.source,
            handleId: e.sourceHandle || 'out',
            nodeLabel: label,
            defaultLabel: `${label} ${e.sourceHandle || 'out'}`,
          });
        }
      }
    });
    
    return {
      candidateInputs: [...ins.values()],
      candidateOutputs: [...outs.values()],
      internalEdges: inner,
    };
  }, [edges, scopeIds, scopeNodes]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [inputState, setInputState] = useState<IOState>({});
  const [outputState, setOutputState] = useState<IOState>({});
  const [placeOnCanvas, setPlaceOnCanvas] = useState(true);
  const [error, setError] = useState('');

  const candidatesRef = useRef({ inputs: candidateInputs, outputs: candidateOutputs });
  useEffect(() => {
    candidatesRef.current = { inputs: candidateInputs, outputs: candidateOutputs };
  }, [candidateInputs, candidateOutputs]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setName('');
      setDescription('');
      setError('');
      const initIns: IOState = {};
      candidatesRef.current.inputs.forEach((c) => {
        initIns[c.id] = { include: true, label: c.defaultLabel };
      });
      setInputState(initIns);
      const initOuts: IOState = {};
      candidatesRef.current.outputs.forEach((c) => {
        initOuts[c.id] = { include: true, label: c.defaultLabel };
      });
      setOutputState(initOuts);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please give the template a name.');
      return;
    }
    if (scopeNodes.length === 0) {
      setError('There are no nodes to package.');
      return;
    }
    const inputs: IOPoint[] = candidateInputs
      .filter((c) => inputState[c.id]?.include)
      .map((c) => ({
        id: c.id,
        label: (inputState[c.id]?.label || '').trim() || c.defaultLabel,
        nodeId: c.nodeId,
        handleId: c.handleId,
      }));
    const outputs: IOPoint[] = candidateOutputs
      .filter((c) => outputState[c.id]?.include)
      .map((c) => ({
        id: c.id,
        label: (outputState[c.id]?.label || '').trim() || c.defaultLabel,
        nodeId: c.nodeId,
        handleId: c.handleId,
      }));

    const template: Template = {
      id: `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      description: description.trim(),
      nodes: scopeNodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })),
      edges: internalEdges.map((e) => ({ ...e })),
      inputs,
      outputs,
    };

    onCreated?.({ template, placeOnCanvas });
    onClose();
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '0 0 8px 0',
  };

  const fieldLabel: React.CSSProperties = {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
    display: 'block',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0f0f0f',
    border: '1px solid #2a2a2a',
    borderRadius: 6,
    color: '#e0e0e0',
    fontSize: 13,
    padding: '8px 10px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const renderIORow = (item: IOCandidate, state: IOState, setState: React.Dispatch<React.SetStateAction<IOState>>) => {
    const entry = state[item.id] || { include: true, label: item.defaultLabel };
    return (
      <div
        key={item.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 8px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid #222',
          borderRadius: 6,
          marginBottom: 6,
        }}
      >
        <input
          type="checkbox"
          checked={entry.include}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setState((s) => ({ ...s, [item.id]: { ...entry, include: e.target.checked } }))
          }
          style={{ accentColor: '#a78bfa' }}
        />
        <input
          type="text"
          value={entry.label}
          disabled={!entry.include}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setState((s) => ({ ...s, [item.id]: { ...entry, label: e.target.value } }))
          }
          style={{
            ...inputStyle,
            padding: '4px 8px',
            fontSize: 12,
            opacity: entry.include ? 1 : 0.4,
          }}
        />
        <span style={{ fontSize: 10, color: '#666', whiteSpace: 'nowrap' }}>
          {item.nodeLabel}
        </span>
      </div>
    );
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1C1C1C',
          border: '1px solid #333',
          borderRadius: 16,
          width: 560,
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #2a2a2a',
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Workflow Template Builder
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginTop: 2 }}>
              {selectedNodes.length > 0
                ? `Package ${scopeNodes.length} selected node${scopeNodes.length === 1 ? '' : 's'}`
                : `Package entire workflow (${scopeNodes.length} node${scopeNodes.length === 1 ? '' : 's'})`}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5, margin: '0 0 20px 0' }}>
            Define the inputs and outputs to package this as a reusable Workflow Template.
            Templates can be dropped on the canvas as a single node, or run through the
            simplified app interface.
          </p>

          <div style={{ marginBottom: 16 }}>
            <label style={fieldLabel}>Template name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Virtual Try-On"
              style={inputStyle}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={fieldLabel}>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this template do?"
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Inputs */}
          <div style={{ marginBottom: 18 }}>
            <h4 style={sectionTitle}>
              Inputs · {candidateInputs.filter((c) => inputState[c.id]?.include).length}/{candidateInputs.length}
            </h4>
            {candidateInputs.length === 0 ? (
              <div
                style={{
                  fontSize: 12,
                  color: '#666',
                  fontStyle: 'italic',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed #2a2a2a',
                  borderRadius: 6,
                }}
              >
                No incoming edges from outside the selection. The template will have no inputs.
              </div>
            ) : (
              candidateInputs.map((c) => renderIORow(c, inputState, setInputState))
            )}
          </div>

          {/* Outputs */}
          <div style={{ marginBottom: 18 }}>
            <h4 style={sectionTitle}>
              Outputs · {candidateOutputs.filter((c) => outputState[c.id]?.include).length}/{candidateOutputs.length}
            </h4>
            {candidateOutputs.length === 0 ? (
              <div
                style={{
                  fontSize: 12,
                  color: '#666',
                  fontStyle: 'italic',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed #2a2a2a',
                  borderRadius: 6,
                }}
              >
                No outgoing edges from inside the selection. The template will have no outputs.
              </div>
            ) : (
              candidateOutputs.map((c) => renderIORow(c, outputState, setOutputState))
            )}
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: '#bbb',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={placeOnCanvas}
              onChange={(e) => setPlaceOnCanvas(e.target.checked)}
              style={{ accentColor: '#a78bfa' }}
            />
            Drop template node on canvas after saving
          </label>

          {error && (
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: '#f87171',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: 6,
                padding: '8px 10px',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #2a2a2a',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#888',
              border: '1px solid #333',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#a78bfa',
              color: '#0b0b0b',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilderModal;
