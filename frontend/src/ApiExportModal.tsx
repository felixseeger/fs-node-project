import React, { useState, useCallback } from 'react';

type TabKey = 'Javascript' | 'Python' | 'Claude Code';

function CopyIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="#aaa" strokeWidth="1.3" />
      <path d="M11 5V3.5C11 2.67 10.33 2 9.5 2H3.5C2.67 2 2 2.67 2 3.5V9.5C2 10.33 2.67 11 3.5 11H5" stroke="#aaa" strokeWidth="1.3" />
    </svg>
  );
}

interface ApiExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes?: any[];
  edges?: any[];
  workflowId?: string;
}

export default function ApiExportModal({ isOpen, onClose, nodes = [], edges = [], workflowId = 'wf_abc123' }: ApiExportModalProps): React.ReactElement | null {
  const [activeTab, setActiveTab] = useState<TabKey>('Javascript');
  const [copied, setCopied] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const API_URL = `https://api.kora.ai/v1/workflows/${workflowId}`;

  const getDynamicCode = useCallback((tab: TabKey): string => {
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const nodeTypes = Array.from(new Set(nodes.map(n => n.type))).join(', ');
    
    // Find input nodes to extract fields
    const inputNode = nodes.find(n => n.type === 'inputNode' || n.type === 'input');
    const inputFields = inputNode?.data?.fieldValues || {};
    const fieldKeys = Object.keys(inputFields);
    
    const inputPlaceholder = fieldKeys.length > 0 
      ? fieldKeys.map(k => `    ${k}: ${JSON.stringify(inputFields[k])}`).join(',\n')
      : '    prompt: "A beautiful sunset over the ocean"';

    if (tab === 'Javascript') {
      return `// Workflow: ${workflowId} (${nodeCount} nodes, ${edgeCount} edges)
// Nodes: ${nodeTypes}

import { Kora } from '@kora/sdk';

const client = new Kora({
  apiKey: process.env.KORA_API_KEY,
});

// Run the workflow with dynamic inputs
const result = await client.runWorkflow('${workflowId}', {
  input: {
${inputPlaceholder}
  }
});

console.log('Workflow result:', result);`;
    }

    if (tab === 'Python') {
      return `# Workflow: ${workflowId} (${nodeCount} nodes, ${edgeCount} edges)
# Nodes: ${nodeTypes}

from kora import Kora
import os

client = Kora(
    api_key=os.environ.get("KORA_API_KEY")
)

# Run the workflow with dynamic inputs
result = client.run_workflow(
    "${workflowId}",
    input={
${inputPlaceholder}
    }
)

print(f"Workflow result: {result}")`;
    }

    return `npx kora run ${workflowId} ${fieldKeys.map(k => `--${k} ${JSON.stringify(inputFields[k])}`).join(' ')}`;
  }, [nodes, edges, workflowId]);

  const getCode = useCallback((): string => {
    return getDynamicCode(activeTab);
  }, [activeTab, getDynamicCode]);

  const handleCopyCode = useCallback((): void => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [getCode]);

  const handleCopyLink = useCallback((): void => {
    navigator.clipboard.writeText(API_URL);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#141414',
          border: '1px solid #2a2a2a',
          borderRadius: 14,
          width: 620,
          maxWidth: '92vw',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px 0',
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0', margin: 0 }}>
            API Export
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '5px 14px',
              fontSize: 11,
              fontWeight: 600,
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: 6,
              color: '#999',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#555';
              e.currentTarget.style.color = '#ccc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = '#999';
            }}
          >
            ESCAPE
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 28px' }}>
          {/* Link section */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#aaa', marginBottom: 8 }}>
              Link
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <button
                onClick={handleCopyLink}
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#1e1e1e',
                  border: '1px solid #333',
                  borderRadius: 8,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#555'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; }}
              >
                {linkCopied ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <CopyIcon />
                )}
              </button>
              <div
                style={{
                  flex: 1,
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 12,
                  color: '#888',
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {API_URL}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              marginBottom: 0,
              borderBottom: '1px solid #222',
            }}
          >
            {(['Javascript', 'Python', 'Claude Code'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 18px',
                  fontSize: 12,
                  fontWeight: 600,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #f0f0f0' : '2px solid transparent',
                  color: activeTab === tab ? '#f0f0f0' : '#666',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  marginBottom: -1,
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) e.currentTarget.style.color = '#aaa';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) e.currentTarget.style.color = '#666';
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Code preview */}
          <div
            style={{
              position: 'relative',
              background: '#0e0e0e',
              border: '1px solid #222',
              borderLeft: '3px solid #3b82f6',
              borderRadius: '0 0 8px 8px',
              marginTop: 0,
            }}
          >
            <pre
              style={{
                margin: 0,
                padding: '16px 56px 16px 16px',
                fontSize: 12,
                lineHeight: 1.7,
                color: '#ccc',
                fontFamily: '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                maxHeight: 240,
                overflowY: 'auto',
              }}
            >
              {getCode()}
            </pre>

            {/* Copy button inside code block */}
            <button
              onClick={handleCopyCode}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                padding: '5px 14px',
                fontSize: 11,
                fontWeight: 600,
                background: copied ? 'rgba(34,197,94,0.15)' : '#1e1e1e',
                border: `1px solid ${copied ? '#22c55e' : '#333'}`,
                borderRadius: 6,
                color: copied ? '#22c55e' : '#aaa',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.currentTarget.style.borderColor = '#555';
                  e.currentTarget.style.color = '#ccc';
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.color = '#aaa';
                }
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
