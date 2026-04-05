import { useState, useEffect, useRef } from 'react';

export default function BottomBar({
  workflows = [],
  activeWorkflowId = null,
  onSwitchWorkflow,
  onRenameBoard,
  onDeleteBoard,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newBoardMode, setNewBoardMode] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [hoveredBoardId, setHoveredBoardId] = useState(null);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingBoardName, setEditingBoardName] = useState('');
  const dropdownRef = useRef(null);

  const activeWorkflowName = workflows.find(w => w.id === activeWorkflowId)?.name || 'Untitled';

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setNewBoardMode(false);
        setNewBoardName('');
        setEditingBoardId(null);
        setEditingBoardName('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleConfirmNewBoard = () => {
    const trimmed = newBoardName.trim();
    if (!trimmed) return;
    onSwitchWorkflow(trimmed, null, { type: 'scratch' });
    setNewBoardMode(false);
    setNewBoardName('');
    setIsOpen(false);
  };

  const handleCancelNewBoard = () => {
    setNewBoardMode(false);
    setNewBoardName('');
  };

  const handleStartRename = (wf, e) => {
    e.stopPropagation();
    setEditingBoardId(wf.id);
    setEditingBoardName(wf.name);
  };

  const handleConfirmRename = (id) => {
    const trimmed = editingBoardName.trim();
    if (trimmed && onRenameBoard) onRenameBoard(id, trimmed);
    setEditingBoardId(null);
    setEditingBoardName('');
  };

  const handleCancelRename = () => {
    setEditingBoardId(null);
    setEditingBoardName('');
  };

  const handleDeleteBoard = (id, e) => {
    e.stopPropagation();
    if (onDeleteBoard) onDeleteBoard(id);
    setIsOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        background: '#111',
        borderTop: '1px solid #1e1e1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 50,
      }}
    >
      {/* LEFT — Boards dropdown */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(o => !o)}
          onMouseEnter={e => { e.currentTarget.style.background = '#1e1e1e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            height: 28,
            padding: '0 8px',
            background: 'transparent',
            border: 'none',
            borderRadius: 6,
            color: '#ccc',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {/* Board grid icon */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="0.5" y="0.5" width="4.5" height="4.5" rx="1" stroke="#aaa" strokeWidth="1.1" />
            <rect x="7" y="0.5" width="4.5" height="4.5" rx="1" stroke="#aaa" strokeWidth="1.1" />
            <rect x="0.5" y="7" width="4.5" height="4.5" rx="1" stroke="#aaa" strokeWidth="1.1" />
            <rect x="7" y="7" width="4.5" height="4.5" rx="1" stroke="#aaa" strokeWidth="1.1" />
          </svg>
          <span style={{
            maxWidth: 160,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {activeWorkflowName}
          </span>
          {/* Chevron */}
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
              flexShrink: 0,
            }}
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 4px)',
              left: 0,
              minWidth: 220,
              maxWidth: 320,
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 8,
              boxShadow: '0 -4px 24px rgba(0,0,0,0.5)',
              zIndex: 200,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ color: '#666', fontSize: 11, padding: '8px 12px 4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              My Boards
            </div>

            {/* Board list */}
            <div style={{ maxHeight: 240, overflowY: 'auto' }}>
              {workflows.length === 0 ? (
                <div style={{ color: '#555', fontSize: 11, padding: '8px 12px 10px' }}>
                  No boards yet
                </div>
              ) : (
                workflows.map(wf => {
                  const isActive = wf.id === activeWorkflowId;
                  const isEditing = editingBoardId === wf.id;
                  const isHovered = hoveredBoardId === wf.id;

                  return (
                    <div
                      key={wf.id}
                      onMouseEnter={() => setHoveredBoardId(wf.id)}
                      onMouseLeave={() => setHoveredBoardId(null)}
                      onClick={() => {
                        if (isEditing) return;
                        onSwitchWorkflow(wf.name, wf.id, null);
                        setIsOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        width: '100%',
                        padding: isActive ? '7px 8px 7px 10px' : '7px 8px',
                        background: isHovered && !isEditing ? '#2a2a2a' : 'transparent',
                        borderLeft: isActive ? '2px solid #22c55e' : '2px solid transparent',
                        color: '#ccc',
                        fontSize: 12,
                        cursor: isEditing ? 'default' : 'pointer',
                        boxSizing: 'border-box',
                        transition: 'background 0.1s',
                      }}
                    >
                      {/* Active checkmark or spacer */}
                      {isActive ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M2 6L5 9L10 3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span style={{ width: 12, flexShrink: 0 }} />
                      )}

                      {/* Board name or rename input */}
                      {isEditing ? (
                        <input
                          autoFocus
                          type="text"
                          value={editingBoardName}
                          onChange={e => setEditingBoardName(e.target.value)}
                          onBlur={() => handleConfirmRename(wf.id)}
                          onKeyDown={e => {
                            e.stopPropagation();
                            if (e.key === 'Enter') handleConfirmRename(wf.id);
                            if (e.key === 'Escape') handleCancelRename();
                          }}
                          onClick={e => e.stopPropagation()}
                          style={{
                            flex: 1,
                            padding: '2px 6px',
                            fontSize: 12,
                            background: '#111',
                            border: '1px solid #444',
                            borderRadius: 4,
                            color: '#e0e0e0',
                            outline: 'none',
                            minWidth: 0,
                          }}
                        />
                      ) : (
                        <span style={{
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          minWidth: 0,
                        }}>
                          {wf.name}
                        </span>
                      )}

                      {/* Action icons — visible on hover, hidden while editing */}
                      {isHovered && !isEditing && !editingBoardId && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                          {/* Rename */}
                          <button
                            onClick={e => handleStartRename(wf, e)}
                            onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.color = '#ddd'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#777'; }}
                            title="Rename"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 22,
                              height: 22,
                              background: 'transparent',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              padding: 0,
                              outline: 'none',
                              color: '#777',
                            }}
                          >
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                              <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          {/* Delete */}
                          <button
                            onClick={e => handleDeleteBoard(wf.id, e)}
                            onMouseEnter={e => { e.currentTarget.style.background = '#3a1e1e'; e.currentTarget.style.color = '#e05555'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#777'; }}
                            title="Delete"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 22,
                              height: 22,
                              background: 'transparent',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              padding: 0,
                              outline: 'none',
                              color: '#777',
                            }}
                          >
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                              <path d="M2 3H10M4.5 3V2H7.5V3M5 5.5V9M7 5.5V9M3 3L3.5 10H8.5L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer — new board */}
            <div style={{ borderTop: '1px solid #222', padding: 4 }}>
              {newBoardMode ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px' }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Board name..."
                    value={newBoardName}
                    onChange={e => setNewBoardName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleConfirmNewBoard();
                      if (e.key === 'Escape') handleCancelNewBoard();
                    }}
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      fontSize: 12,
                      background: '#111',
                      border: '1px solid #333',
                      borderRadius: 5,
                      color: '#e0e0e0',
                      outline: 'none',
                    }}
                  />
                  {/* Confirm */}
                  <button
                    onClick={handleConfirmNewBoard}
                    onMouseEnter={e => { e.currentTarget.style.background = '#1e3a1e'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {/* Cancel */}
                  <button
                    onClick={handleCancelNewBoard}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2a1e1e'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 2L8 8M8 2L2 8" stroke="#888" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setNewBoardMode(true)}
                  onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#ccc'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888'; }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    width: '100%',
                    padding: '7px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 5,
                    color: '#888',
                    fontSize: 12,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  New Board
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — Credits + User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Credits badge */}
        <div style={{
          padding: '4px 14px',
          fontSize: 12,
          fontWeight: 600,
          background: 'rgba(34,197,94,0.12)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 16,
          color: '#22c55e',
          whiteSpace: 'nowrap',
        }}>
          ~$0.01 · 1,400 credits
        </div>

        {/* User */}
        <div style={{
          padding: '4px 12px',
          fontSize: 12,
          fontWeight: 500,
          background: 'transparent',
          border: '1px solid #333',
          borderRadius: 16,
          color: '#ccc',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
        }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5.5" r="3" stroke="#aaa" strokeWidth="1.3" />
            <path d="M2.5 14.5C2.5 11.5 5 9.5 8 9.5C11 9.5 13.5 11.5 13.5 14.5" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Admin
        </div>
      </div>
    </div>
  );
}
