import { useState, useRef, useEffect } from 'react';

export default function TopBar({ currentPage, onNavigate, workflowName, editorMode, onEditorModeChange, onLogout, onZoomIn, onZoomOut, onZoomFit, onUndo, onRedo, onRename, onDuplicate, isLocked, onLockView, onOpenProfile }) {
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    const defaultMenuItems = [
    { id: 'workspaces', label: 'Workspaces', icon: '&#9864;' },
    { id: 'home', label: 'Back home', icon: '&#9776;' },
    { id: 'editor', label: 'New Workflow', icon: '&#43;' },
    { id: 'divider-1', type: 'divider' },
    { id: 'workflow-settings', label: 'Workflow Settings', icon: '&#9881;' },
    { id: 'profile', label: 'Profile', icon: '&#9786;' },
    { id: 'divider-2', type: 'divider' },
    { id: 'logout', label: 'Sign Out', icon: '&#10140;' },
  ];

  const editorMenuItems = [
    { id: 'home', label: 'Back home' },
    { id: 'profile', label: 'My profile' },
    { id: 'divider-1', type: 'divider' },
    { id: 'editor', label: 'New project' },
    { id: 'duplicate-project', label: 'Duplicate project' },
    { id: 'rename-project', label: 'Rename project' },
    { id: 'undo', label: 'Undo', shortcut: '⌘Z' },
    { id: 'redo', label: 'Redo', shortcut: '⌘⇧Z' },
    { id: 'divider-2', type: 'divider' },
    { id: 'workflow-settings', label: 'Project settings' },
    { id: 'divider-3', type: 'divider' },
    { id: 'zoom-fit', label: 'Zoom to fit', shortcut: '⌘1' },
    { id: 'zoom-in', label: 'Zoom in', shortcut: '⌘+' },
    { id: 'zoom-out', label: 'Zoom out', shortcut: '⌘-' },
    { id: 'lock-view', label: isLocked ? 'Unlock view' : 'Lock view' },
  ];

  const menuItems = currentPage === 'editor' ? editorMenuItems : defaultMenuItems;

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
      <div style={{ display: 'flex', alignItems: 'center', gap: currentPage === 'home' ? 40 : 0 }}>
        {/* Logo with Dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            onMouseEnter={() => setHovered('logo')}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px 8px',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.15s',
              ...(hovered === 'logo' || menuOpen ? { background: '#1a1a1a' } : {}),
            }}
          >
            <img
              src="/logo-light.svg"
              alt="Logo"
              style={{ height: 28, width: 'auto' }}
            />
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              style={{
                transition: 'transform 0.2s',
                transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <path d="M2 4L5 7L8 4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 6,
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: 10,
                padding: 4,
                minWidth: 180,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                zIndex: 100,
              }}
            >
              {menuItems.map((item) =>
                item.type === 'divider' ? (
                  <div
                    key={item.id}
                    style={{
                      height: 1,
                      background: '#2a2a2a',
                      margin: '4px 8px',
                    }}
                  />
                ) : (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'logout') onLogout?.();
                      else if (item.id === 'editor') onNavigate('home');
                      else if (item.id === 'profile') onOpenProfile?.();
                      else if (item.id === 'zoom-in') onZoomIn?.();
                      else if (item.id === 'zoom-out') onZoomOut?.();
                      else if (item.id === 'lock-view') onLockView?.();
                      else if (item.id === 'zoom-fit') onZoomFit?.();
                      else if (item.id === 'undo') onUndo?.();
                      else if (item.id === 'redo') onRedo?.();
                      else if (item.id === 'rename-project') onRename?.();
                      else if (item.id === 'duplicate-project') onDuplicate?.();
                      
                      else onNavigate(item.id);
                      setMenuOpen(false);
                    }}
                    onMouseEnter={() => setHovered(`menu-${item.id}`)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '8px 12px',
                      background: hovered === `menu-${item.id}` ? '#252525' : 'transparent',
                      border: 'none',
                      borderRadius: 7,
                      color: item.id === 'logout'
                        ? (hovered === `menu-${item.id}` ? '#f87171' : '#888')
                        : currentPage === item.id ? '#e0e0e0' : '#999',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {item.icon && <span style={{ fontSize: 14, width: 18, textAlign: 'center', opacity: 0.7 }} dangerouslySetInnerHTML={{ __html: item.icon }} />}
                        {item.label}
                      </span>
                      {item.shortcut && <span style={{ fontSize: 11, color: '#666' }}>{item.shortcut}</span>}
                    </span>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        
        {currentPage === 'home' && (
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>How It Works</a>
            <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>Nodes</a>
            <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>API</a>
            <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>Pricing</a>
          </div>
        )}
        
        {currentPage !== 'home' && (
          <>
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

        </>
        )}

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

      {currentPage === 'home' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>Log In</a>
          <button 
            style={{
              background: '#3B3BFF',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 9999,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#4F46E5'}
            onMouseLeave={e => e.currentTarget.style.background = '#3B3BFF'}
          >
            Get Started
          </button>
        </div>
      )}

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
