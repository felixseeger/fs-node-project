import { useState } from 'react';

export default function TopBar({ currentPage, onNavigate, workflowName, editorMode, onEditorModeChange }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        height: 48,
        background: '#0c0c0c',
        borderBottom: '1px solid #1e1e1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
      }}
    >
      {/* Left — Logo + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {/* Logo */}
        <img
          src="/logo-light.svg"
          alt="Logo"
          style={{ height: 28, width: 'auto' }}
        />

        {/* Breadcrumb separator + Workflows link (always shown) */}
        <span style={{ color: '#444', margin: '0 12px', fontSize: 14, userSelect: 'none' }}>/</span>
        <button
          onClick={() => onNavigate('home')}
          onMouseEnter={() => setHovered('workflows')}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            fontSize: 13,
            fontWeight: 500,
            color: currentPage === 'home' ? '#e0e0e0' : '#888',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            transition: 'color 0.15s',
            ...(hovered === 'workflows' && currentPage !== 'home' ? { color: '#bbb' } : {}),
          }}
        >
          {currentPage !== 'home' && (
            <span style={{ fontSize: 12 }}>&lsaquo;</span>
          )}
          Workflows
        </button>

        {/* Workflow name (only in editor) */}
        {currentPage === 'editor' && workflowName && (
          <>
            <span style={{ color: '#444', margin: '0 12px', fontSize: 14, userSelect: 'none' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#e0e0e0' }}>
              {workflowName}
            </span>
          </>
        )}
      </div>

      {/* Right — Interface / Node Editor toggle (only in editor) */}
      {currentPage === 'editor' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#1a1a1a',
          borderRadius: 8,
          border: '1px solid #2a2a2a',
          padding: 2,
        }}>
          <button
            onClick={() => onEditorModeChange?.('interface')}
            onMouseEnter={() => setHovered('interface')}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 500,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: editorMode === 'interface' ? '#2a2a2a' : 'transparent',
              color: editorMode === 'interface' ? '#f0f0f0' : '#777',
              ...(hovered === 'interface' && editorMode !== 'interface' ? { color: '#aaa' } : {}),
            }}
          >
            Interface
          </button>
          <button
            onClick={() => onEditorModeChange?.('node-editor')}
            onMouseEnter={() => setHovered('node-editor')}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 500,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: editorMode === 'node-editor' ? '#2a2a2a' : 'transparent',
              color: editorMode === 'node-editor' ? '#f0f0f0' : '#777',
              ...(hovered === 'node-editor' && editorMode !== 'node-editor' ? { color: '#aaa' } : {}),
            }}
          >
            Node Editor
          </button>
        </div>
      )}
    </div>
  );
}
