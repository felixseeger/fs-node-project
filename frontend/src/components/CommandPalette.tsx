import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NODE_MENU } from '../config/nodeMenu';
import { MODELS as IMAGE_MODELS } from '../nodes/imageUniversalGeneratorModels';
import { MODELS as VIDEO_MODELS } from '../nodes/videoUniversalGeneratorModels';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (type: string, data: any) => void;
  onRunWorkflow: () => void;
  onClearCanvas: () => void;
  onFitView: () => void;
  onExportJSON: () => void;
  onExportScreenshot: () => void;
  onProjectSettings: () => void;
  onOpenHistory: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onMenuAction?: (action: string) => void;
}

interface PaletteItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  shortcut?: string;
  action: () => void;
  icon?: React.ReactNode;
}

const DefaultIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const CommandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const ModelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const NodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const isMacOS = typeof navigator !== 'undefined' && navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMacOS ? '⌘' : 'Ctrl';

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onAddNode,
  onRunWorkflow,
  onClearCanvas,
  onFitView,
  onExportJSON,
  onExportScreenshot,
  onProjectSettings,
  onOpenHistory,
  onUndo,
  onRedo,
  onMenuAction,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Define data sources
  const items = useMemo<PaletteItem[]>(() => {
    const list: PaletteItem[] = [];

    // Commands
    list.push(
      { id: 'cmd-run', category: 'Commands', title: 'Run Workflow', action: onRunWorkflow, icon: <CommandIcon />, shortcut: `${modKey} Enter` },
      { id: 'cmd-clear', category: 'Commands', title: 'Clear Canvas', action: onClearCanvas, icon: <CommandIcon /> },
      { id: 'cmd-fit', category: 'Commands', title: 'Fit View', action: onFitView, icon: <CommandIcon />, shortcut: `${modKey} 1` },
      { id: 'cmd-export-json', category: 'Commands', title: 'Export to JSON', action: onExportJSON, icon: <CommandIcon /> },
      { id: 'cmd-export-png', category: 'Commands', title: 'Export Screenshot', action: onExportScreenshot, icon: <CommandIcon />, shortcut: `${modKey}⇧S` },
      { id: 'cmd-settings', category: 'Commands', title: 'Project Settings', action: onProjectSettings, icon: <CommandIcon /> },
      { id: 'cmd-history', category: 'Commands', title: 'Open History', action: onOpenHistory, icon: <CommandIcon /> }
    );

    if (onUndo) {
      list.push({ id: 'cmd-undo', category: 'Commands', title: 'Undo', action: onUndo, icon: <CommandIcon />, shortcut: `${modKey} Z` });
    }
    if (onRedo) {
      list.push({ id: 'cmd-redo', category: 'Commands', title: 'Redo', action: onRedo, icon: <CommandIcon />, shortcut: `${modKey}⇧Z` });
    }
    if (onMenuAction) {
      list.push(
        { id: 'cmd-copy', category: 'Commands', title: 'Copy', action: () => onMenuAction('copy'), icon: <CommandIcon />, shortcut: `${modKey} C` },
        { id: 'cmd-cut', category: 'Commands', title: 'Cut', action: () => onMenuAction('cut'), icon: <CommandIcon />, shortcut: `${modKey} X` },
        { id: 'cmd-paste', category: 'Commands', title: 'Paste', action: () => onMenuAction('paste'), icon: <CommandIcon />, shortcut: `${modKey} V` },
        { id: 'cmd-duplicate', category: 'Commands', title: 'Duplicate', action: () => onMenuAction('duplicate'), icon: <CommandIcon />, shortcut: `${modKey} D` },
        { id: 'cmd-disconnect', category: 'Commands', title: 'Disconnect Nodes', action: () => onMenuAction('disconnect_nodes'), icon: <CommandIcon />, shortcut: `${modKey}⇧D` },
        { id: 'cmd-clear-contents', category: 'Commands', title: 'Clear Contents', action: () => onMenuAction('clear_contents'), icon: <CommandIcon />, shortcut: `${modKey}⇧X` }
      );
    }

    // Tools (Utilities)
    const utilsSection = NODE_MENU.find(s => s.section === 'Utilities');
    if (utilsSection) {
      utilsSection.items.forEach(item => {
        list.push({
          id: `tool-${item.type}`,
          category: 'Tools',
          title: `Add ${item.label}`,
          subtitle: item.description,
          action: () => onAddNode(item.type, item.defaults || {}),
          icon: <NodeIcon />,
        });
      });
    }

    // Nodes
    NODE_MENU.forEach(section => {
      if (section.section === 'Utilities') return; // Handled as Tools
      section.items.forEach(item => {
        list.push({
          id: `node-${item.type}`,
          category: 'Nodes',
          title: `Add ${item.label}`,
          subtitle: item.description,
          action: () => onAddNode(item.type, item.defaults || {}),
          icon: <NodeIcon />,
        });
      });
    });

    // Image Models
    Object.keys(IMAGE_MODELS).forEach(key => {
      const model = (IMAGE_MODELS as any)[key];
      list.push({
        id: `model-img-${key}`,
        category: 'Image Models',
        title: `Model: ${model.name}`,
        subtitle: model.provider,
        action: () => onAddNode('universalGeneratorImage', { model: key }),
        icon: <ModelIcon />,
      });
    });

    // Video Models
    Object.keys(VIDEO_MODELS).forEach(key => {
      const model = (VIDEO_MODELS as any)[key];
      list.push({
        id: `model-vid-${key}`,
        category: 'Video Models',
        title: `Model: ${model.name}`,
        subtitle: model.provider,
        action: () => onAddNode('universalGeneratorVideo', { model: key }),
        icon: <ModelIcon />,
      });
    });

    return list;
  }, [onAddNode, onRunWorkflow, onClearCanvas, onFitView, onExportJSON, onExportScreenshot, onProjectSettings, onOpenHistory, onUndo, onRedo, onMenuAction]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      result = items.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.category.toLowerCase().includes(lowerQuery) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(lowerQuery))
      );
    }
    // Sort items alphabetically by title
    return result.sort((a, b) => a.title.localeCompare(b.title));
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Timeout needed for focus if rendering lazily
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll selected item into view
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, filteredItems]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filteredItems[selectedIndex];
      if (item) {
        item.action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PaletteItem[]>);

  let globalIndex = 0;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '10vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#1C1C1C',
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '60vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, nodes, models..."
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '18px',
              outline: 'none',
            }}
          />
        </div>

        <div
          ref={listRef}
          style={{
            overflowY: 'auto',
            flex: 1,
            padding: '8px',
          }}
        >
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} style={{ marginBottom: '8px' }}>
              <div style={{
                padding: '8px 12px',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                color: '#888',
              }}>
                {category}
              </div>
              {items.map(item => {
                const isSelected = globalIndex === selectedIndex;
                const currentIndex = globalIndex++;

                return (
                  <div
                    key={item.id}
                    data-selected={isSelected}
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      color: isSelected ? '#fff' : '#a3a3a3',
                      transition: 'background-color 0.1s, color 0.1s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ color: isSelected ? '#e2e8f0' : '#64748b' }}>
                        {item.icon || <DefaultIcon />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</span>
                        {item.subtitle && (
                          <span style={{ fontSize: '12px', color: isSelected ? '#a3a3a3' : '#64748b' }}>
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                    {item.shortcut && (
                      <div style={{
                        fontSize: '12px',
                        padding: '2px 6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        color: '#a3a3a3',
                      }}>
                        {item.shortcut}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
