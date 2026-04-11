import React, { useState, useEffect, FC, ChangeEvent } from 'react';

interface Shortcut {
  keys: string[];
  description: string;
}

interface ShortcutCategory {
  category: string;
  shortcuts: Shortcut[];
}

const shortcutCategories: ShortcutCategory[] = [
  {
    category: 'Canvas Navigation',
    shortcuts: [
      { keys: ['Arrow Keys'], description: 'Pan the canvas' },
      { keys: ['+', '-'], description: 'Zoom in/out' },
      { keys: ['Ctrl/Cmd+1'], description: 'Fit view to all nodes' },
      { keys: ['Ctrl/Cmd+2'], description: 'Center on selected node' },
    ]
  },
  {
    category: 'Node Selection',
    shortcuts: [
      { keys: ['Click'], description: 'Select single node' },
      { keys: ['Shift+Click'], description: 'Add to selection' },
      { keys: ['Ctrl/Cmd+A'], description: 'Select all nodes' },
      { keys: ['Escape'], description: 'Deselect all' },
    ]
  },
  {
    category: 'Node Creation',
    shortcuts: [
      { keys: ['T'], description: 'Create Text node' },
      { keys: ['C'], description: 'Create Comment node' },
      { keys: ['L'], description: 'Create Layer Editor node' },
      { keys: ['A'], description: 'Create Asset node' },
      { keys: ['B'], description: 'Create Group Editing node' },
      { keys: ['R'], description: 'Create Router node' },
      { keys: ['U'], description: 'Create Source Media node' },
    ]
  },
  {
    category: 'Node Editing',
    shortcuts: [
      { keys: ['F'], description: 'Toggle node fold state' },
      { keys: ['M'], description: 'Toggle node mute state' },
      { keys: ['Ctrl/Cmd+C'], description: 'Copy selected nodes' },
      { keys: ['Ctrl/Cmd+X'], description: 'Cut selected nodes' },
      { keys: ['Ctrl/Cmd+V'], description: 'Paste nodes' },
      { keys: ['Ctrl/Cmd+D'], description: 'Duplicate selected nodes' },
      { keys: ['Ctrl/Cmd+Shift+D'], description: 'Disconnect selected nodes' },
      { keys: ['Ctrl/Cmd+Shift+X'], description: 'Clear node contents' },
      { keys: ['Alt+Click Handle'], description: 'Disconnect specific handle' },
    ]
  },
  {
    category: 'Workflow',
    shortcuts: [
      { keys: ['Ctrl/Cmd+Enter'], description: 'Execute workflow' },
      { keys: ['Ctrl/Cmd+Z'], description: 'Undo' },
      { keys: ['Ctrl/Cmd+Shift+Z'], description: 'Redo' },
      { keys: ['Ctrl/Cmd+Shift+S'], description: 'Take screenshot' },
    ]
  },
  {
    category: 'View',
    shortcuts: [
      { keys: ['V'], description: 'Select tool' },
      { keys: ['H'], description: 'Hand tool (pan)' },
      { keys: ['I'], description: 'Toggle editor/interface view' },
      { keys: ['Ctrl/Cmd+.'], description: 'Show keyboard shortcuts' },
    ]
  }
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  useEffect(() => {
    const handleShortcutEvent = () => {
      if (isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('open-keyboard-shortcuts', handleShortcutEvent);
    
    return () => {
      window.removeEventListener('open-keyboard-shortcuts', handleShortcutEvent);
    };
  }, [isOpen, onClose]);

  const filteredShortcuts = shortcutCategories.map(category => {
    const filtered = category.shortcuts.filter(shortcut => 
      shortcut.keys.some(key => key.toLowerCase().includes(searchTerm.toLowerCase())) ||
      shortcut.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...category, shortcuts: filtered };
  }).filter(category => category.shortcuts.length > 0);

  const renderShortcutsContent = () => {
    if (filteredShortcuts.length === 0) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 200,
          color: 'var(--color-text-dim)',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"></path>
            <path d="M21 21L16.65 16.65"></path>
          </svg>
          <p style={{ marginTop: 16, fontSize: 14 }}>No shortcuts found</p>
        </div>
      );
    }

    return filteredShortcuts.map((category, index) => (
      <div key={index} style={{ marginBottom: 24 }}>
        <h3 style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-text-dim)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 12,
        }}>
          {category.category}
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px',
        }}>
          {category.shortcuts.map((shortcut, shortcutIndex) => (
            <div
              key={shortcutIndex}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
              }}
            >
              <div style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
              }}>
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    style={{
                      padding: '4px 8px',
                      background: 'var(--color-surface-sunken)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <span style={{
                fontSize: 14,
                color: 'var(--color-text)',
                flex: 1,
              }}>
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        width: '100%',
        maxWidth: 800,
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-text)',
            margin: 0,
          }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            title="Close"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '16px 24px' }}>
          <div style={{
            position: 'relative',
          }}>
            <svg
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
                color: 'var(--color-text-dim)',
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                background: 'var(--color-surface-sunken)',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                color: 'var(--color-text)',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Shortcuts Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 24px',
        }}>
          {renderShortcutsContent()}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              fontWeight: 600,
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-text)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
