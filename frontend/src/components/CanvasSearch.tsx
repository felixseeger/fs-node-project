import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NODE_MENU } from '../config/nodeMenu';

interface CanvasSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string, defaults: any) => void;
  position: { x: number; y: number };
}

export const CanvasSearch: React.FC<CanvasSearchProps> = ({ isOpen, onClose, onSelect, position }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    const list: { type: string; label: string; description?: string; defaults?: any }[] = [];
    NODE_MENU.forEach(section => {
      section.items.forEach(item => {
        list.push(item);
      });
    });
    return list;
  }, []);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.slice(0, 10);
    const lowerQuery = query.toLowerCase();
    return items.filter(item => 
      item.label.toLowerCase().includes(lowerQuery) || 
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    ).slice(0, 10);
  }, [items, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
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
          onSelect(item.type, item.defaults || {});
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onSelect, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: '280px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        zIndex: 10000,
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ padding: '12px', borderBottom: '1px solid #333' }}>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Add node..."
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>
      <div ref={listRef} style={{ maxHeight: '300px', overflowY: 'auto', padding: '4px' }}>
        {filteredItems.map((item, idx) => (
          <div
            key={item.type}
            onClick={() => {
              onSelect(item.type, item.defaults || {});
              onClose();
            }}
            onMouseEnter={() => setSelectedIndex(idx)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: idx === selectedIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: idx === selectedIndex ? '#fff' : '#aaa',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.label}</span>
            {item.description && (
              <span style={{ fontSize: '11px', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.description}
              </span>
            )}
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div style={{ padding: '12px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
            No nodes found
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
