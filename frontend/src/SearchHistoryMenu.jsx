import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getHistory, downloadHistoryItem, clearHistory } from './services/historyService';

const SearchIcon = ({ style }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FilterIcon = ({ style }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="4" y1="21" x2="4" y2="14"></line>
    <line x1="4" y1="10" x2="4" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12" y2="3"></line>
    <line x1="20" y1="21" x2="20" y2="16"></line>
    <line x1="20" y1="12" x2="20" y2="3"></line>
    <line x1="1" y1="14" x2="7" y2="14"></line>
    <line x1="9" y1="8" x2="15" y2="8"></line>
    <line x1="17" y1="16" x2="23" y2="16"></line>
  </svg>
);

const ExpandIcon = ({ style }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

const CloseIcon = ({ style }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const DownloadIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const ReuseIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="17 1 21 5 17 9"></polyline>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
    <polyline points="7 23 3 19 7 15"></polyline>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
  </svg>
);

export default function SearchHistoryMenu({ isOpen, onClose, onReuseItem }) {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredHistory = history.filter(item => {
    const matchesSearch = !searchQuery || 
      item.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nodeLabel?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleReuse = (item) => {
    onReuseItem?.(item);
    onClose();
  };

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <div 
        style={{
          width: '420px',
          height: '560px',
          backgroundColor: '#121212',
          borderRadius: '16px',
          border: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: '1px solid #222'
        }}>
          {/* Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1E1E1E',
            border: '1px solid #333',
            borderRadius: '9999px',
            padding: '8px 16px',
            flex: 1,
            marginRight: '24px'
          }}>
            <SearchIcon style={{ color: '#888', marginRight: '10px' }} />
            <input 
              type="text" 
              placeholder="Search generated media..." 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '14px',
                width: '100%'
              }}
            />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setFilterType(filterType === 'all' ? 'svg' : filterType === 'svg' ? 'image' : 'all')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: filterType !== 'all' ? '#4ade80' : '#888' }} 
              title={`Filter: ${filterType}`}
            >
              <FilterIcon />
            </button>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#888' }} title="Expand">
              <ExpandIcon />
            </button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#888' }} title="Close">
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: '8px'
        }}>
          {filteredHistory.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666',
              textAlign: 'center'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '12px', opacity: 0.3 }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <p style={{ margin: 0, fontSize: '14px' }}>No generated media yet</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.7 }}>Generated images, SVGs, and videos will appear here</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid #2a2a2a',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                {/* Thumbnail */}
                {item.url ? (
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: '#222',
                    flexShrink: 0
                  }}>
                    {item.type === 'svg' ? (
                      <img 
                        src={item.url} 
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <img 
                        src={item.url} 
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                ) : (
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '4px',
                    backgroundColor: '#222',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      backgroundColor: item.type === 'svg' ? '#4ade80' : item.type === 'video' ? '#14b8a6' : '#ec4899',
                      color: '#000'
                    }}>
                      {item.type}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: '#666'
                    }}>
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#fff',
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {item.prompt || 'No prompt'}
                  </p>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '11px',
                    color: '#888'
                  }}>
                    {item.nodeLabel}
                  </p>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <button
                    onClick={() => downloadHistoryItem(item.id)}
                    style={{
                      backgroundColor: '#222',
                      border: '1px solid #333',
                      borderRadius: '4px',
                      padding: '6px',
                      cursor: 'pointer',
                      color: '#888',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Download"
                  >
                    <DownloadIcon />
                  </button>
                  <button
                    onClick={() => handleReuse(item)}
                    style={{
                      backgroundColor: '#222',
                      border: '1px solid #333',
                      borderRadius: '4px',
                      padding: '6px',
                      cursor: 'pointer',
                      color: '#888',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Reuse"
                  >
                    <ReuseIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {filteredHistory.length > 0 && (
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #222',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#666'
          }}>
            <span>{filteredHistory.length} items</span>
            <button
              onClick={() => {
                clearHistory();
                setHistory([]);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
