import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const categories = [
    {
      title: 'Canvas & Navigation',
      shortcuts: [
        { keys: ['⌘', '+'], label: 'Zoom in' },
        { keys: ['⌘', '-'], label: 'Zoom out' },
        { keys: ['⌘', '1'], label: 'Zoom to fit' },
        { keys: ['Space', 'Drag'], label: 'Pan canvas' },
      ]
    },
    {
      title: 'Nodes & Selection',
      shortcuts: [
        { keys: ['⌘', 'A'], label: 'Select all nodes' },
        { keys: ['Esc'], label: 'Deselect all' },
        { keys: ['⌘', 'C'], label: 'Copy selected nodes' },
        { keys: ['⌘', 'V'], label: 'Paste nodes' },
        { keys: ['⌘', 'D'], label: 'Duplicate selected nodes' },
        { keys: ['Backspace'], label: 'Delete selected nodes' },
        { keys: ['⌘', '⇧', 'X'], label: 'Clear node contents' },
      ]
    },
    {
      title: 'History & Actions',
      shortcuts: [
        { keys: ['⌘', 'Z'], label: 'Undo' },
        { keys: ['⌘', '⇧', 'Z'], label: 'Redo' },
        { keys: ['⌘', '⇧', 'D'], label: 'Download / Export' },
      ]
    },
    {
      title: 'Quick Add Nodes',
      shortcuts: [
        { keys: ['T'], label: 'Add Text' },
        { keys: ['C'], label: 'Add Comment' },
        { keys: ['L'], label: 'Add Layer Editor' },
        { keys: ['A'], label: 'Add Asset' },
        { keys: ['B'], label: 'Add Group Editor' },
        { keys: ['R'], label: 'Add Router' },
        { keys: ['F'], label: 'Add Facial Editor' },
        { keys: ['V'], label: 'Add Video Improve' },
        { keys: ['U'], label: 'Add Upload' },
      ]
    }
  ];

  const modalContent = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '640px',
          maxHeight: '80vh',
          background: '#1A1A1A',
          borderRadius: '16px',
          border: '1px solid #333',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #2a2a2a'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#EAEAEA', margin: 0 }}>Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', color: '#888', cursor: 'pointer',
              padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#888'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          {categories.map((category, idx) => (
            <div key={idx} style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>
                {category.title}
              </h3>
              {category.shortcuts.map((shortcut, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#EAEAEA' }}>{shortcut.label}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {shortcut.keys.map((key, kIdx) => (
                      <kbd key={kIdx} style={{
                        background: '#2A2A2A',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        color: '#fff',
                        minWidth: '24px',
                        textAlign: 'center',
                        display: 'inline-block',
                        boxShadow: '0 2px 0 rgba(0,0,0,0.2)'
                      }}>
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Only create portal if document.body exists
  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }

  return null;
}
