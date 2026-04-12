import React, { useRef, useState, useCallback, type FC } from 'react';
import DrawflowEditor, { type DrawflowEditorRef } from './components/DrawflowEditor';

const surface = {
  bg: 'var(--color-bg, #1a1a1a)',
  panel: 'var(--color-surface, #2a2a2a)',
  border: 'var(--color-border, #3a3a3a)',
  text: 'var(--color-text, #e0e0e0)',
  textDim: 'var(--color-text-dim, #888)',
};

function addDemoGraph(editor: any) {
  const inputHtml = '<div class="title-box">Input</div><div class="box">Prompt / media</div>';
  const procHtml = '<div class="title-box">Process</div><div class="box">Transform</div>';
  const outHtml = '<div class="title-box">Output</div><div class="box">Result</div>';
  editor.addNode('input', 0, 1, 80, 120, 'df-node-input', {}, inputHtml);
  editor.addNode('process', 1, 1, 320, 100, 'df-node-process', {}, procHtml);
  editor.addNode('output', 1, 0, 560, 120, 'df-node-output', {}, outHtml);
}

export const DrawflowLab: FC = () => {
  const apiRef = useRef<DrawflowEditorRef>(null);
  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState('');

  const onEditorReady = useCallback((editor: any) => {
    addDemoGraph(editor);
  }, []);

  const getEditor = () => apiRef.current?.getEditor();

  const handleAdd = (kind: 'input' | 'process' | 'output') => {
    const ed = getEditor();
    if (!ed) return;
    const y = 40 + Math.random() * 120;
    const x = 40 + Math.random() * 200;
    if (kind === 'input') {
      ed.addNode(
        'input',
        0,
        1,
        x,
        y,
        'df-node-input',
        {},
        '<div class="title-box">Input</div><div class="box">New input</div>'
      );
    } else if (kind === 'process') {
      ed.addNode(
        'process',
        1,
        1,
        x,
        y,
        'df-node-process',
        {},
        '<div class="title-box">Process</div><div class="box">Step</div>'
      );
    } else {
      ed.addNode(
        'output',
        1,
        0,
        x,
        y,
        'df-node-output',
        {},
        '<div class="title-box">Output</div><div class="box">Sink</div>'
      );
    }
    setStatus('Node added');
  };

  const handleExport = () => {
    const raw = apiRef.current?.export?.();
    if (raw == null) {
      setStatus('Editor not ready');
      return;
    }
    const text = typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2);
    setImportText(text);
    void navigator.clipboard?.writeText(text).then(
      () => setStatus('Exported and copied to clipboard'),
      () => setStatus('Exported (clipboard unavailable)')
    );
  };

  const handleImport = () => {
    const ed = getEditor();
    if (!ed) {
      setStatus('Editor not ready');
      return;
    }
    try {
      const data = JSON.parse(importText);
      ed.import(data);
      setStatus('Import OK');
    } catch (e: any) {
      setStatus(`Import failed: ${e.message}`);
    }
  };

  const handleClear = () => {
    const ed = getEditor();
    if (!ed) return;
    ed.clear();
    setStatus('Cleared');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        background: surface.bg,
        color: surface.text,
      }}
    >
      <style>{`
        .drawflow .df-node-input .title-box { background: #6b7280; }
        .drawflow .df-node-process .title-box { background: #f97316; }
        .drawflow .df-node-output .title-box { background: #14b8a6; }
        .drawflow .box { padding: 8px 10px; font-size: 12px; color: #e0e0e0; }
        .parent-drawflow { background: ${surface.bg} !important; background-image: radial-gradient(#333 1px, transparent 1px) !important; background-size: 24px 24px !important; }
      `}</style>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          borderBottom: `1px solid ${surface.border}`,
          background: surface.panel,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, marginRight: 8 }}>Drawflow</span>
        <button type="button" onClick={() => handleAdd('input')} style={btnStyle}>
          + Input
        </button>
        <button type="button" onClick={() => handleAdd('process')} style={btnStyle}>
          + Process
        </button>
        <button type="button" onClick={() => handleAdd('output')} style={btnStyle}>
          + Output
        </button>
        <button type="button" onClick={handleExport} style={btnStyle}>
          Export
        </button>
        <button type="button" onClick={handleImport} style={btnStyle}>
          Import JSON
        </button>
        <button type="button" onClick={handleClear} style={{ ...btnStyle, opacity: 0.85 }}>
          Clear
        </button>
        {status ? (
          <span style={{ fontSize: 12, color: surface.textDim, marginLeft: 'auto' }}>{status}</span>
        ) : null}
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <DrawflowEditor ref={apiRef} onEditorReady={onEditorReady} style={{ position: 'absolute', inset: 0 }} />
        </div>
        <div
          style={{
            width: 320,
            flexShrink: 0,
            borderLeft: `1px solid ${surface.border}`,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            background: surface.panel,
          }}
        >
          <div style={{ padding: '8px 12px', fontSize: 12, color: surface.textDim }}>
            JSON (edit and Import)
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="{ &quot;drawflow&quot;: { ... } }"
            style={{
              flex: 1,
              minHeight: 120,
              margin: '0 8px 8px',
              padding: 8,
              fontSize: 11,
              fontFamily: 'ui-monospace, monospace',
              background: surface.bg,
              color: surface.text,
              border: `1px solid ${surface.border}`,
              borderRadius: 6,
              resize: 'vertical',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 500,
  borderRadius: 6,
  border: '1px solid var(--color-border, #3a3a3a)',
  background: 'var(--color-bg, #1a1a1a)',
  color: 'var(--color-text, #e0e0e0)',
  cursor: 'pointer',
};

export default DrawflowLab;
