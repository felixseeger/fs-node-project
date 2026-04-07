import { useState, useRef, useEffect } from 'react';

export default function TopBar({ currentPage, onNavigate, workflowName, editorMode, onEditorModeChange, onLogout, onZoomIn, onZoomOut, onZoomFit, onUndo, onRedo, onRename, onDuplicate, isLocked, onLockView, onOpenProfile, isAuthenticated }) {
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
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

  // Active section detection via IntersectionObserver
  useEffect(() => {
    if (isAuthenticated) return;
    const sections = ['how-it-works', 'built-for-builders', 'models', 'nodes'];
    const observers = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isAuthenticated, currentPage]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const container = document.getElementById('landing-scroll');
    if (container) {
      const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
      container.scrollTo({ top, behavior: 'smooth' });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        position: 'relative',
      }}
    >
      {/* Left — Logo + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: currentPage === 'home' ? 40 : 0 }}>
        {/* Logo with Dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          {isAuthenticated ? (
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
              <img src="/logo-light.svg" alt="Logo" style={{ height: 28, width: 'auto' }} />
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                style={{ transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M2 4L5 7L8 4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
              <img src="/logo-light.svg" alt="Logo" style={{ height: 28, width: 'auto' }} />
            </div>
          )}

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

        

        {isAuthenticated && currentPage === 'home' && (
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('workspaces'); }} style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>Workflows</a>
            <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>Templates</a>
          </div>
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

      {/* Center Nav — absolutely centered on X */}
      {!isAuthenticated && (
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 32,
          alignItems: 'center',
          pointerEvents: 'none',
        }}>
          <a
            href="#how-it-works"
            onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}
            style={{ color: activeSection === 'how-it-works' ? '#fff' : '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: activeSection === 'how-it-works' ? 600 : 500, transition: 'color 0.2s', pointerEvents: 'auto' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = activeSection === 'how-it-works' ? '#fff' : '#a9a9a9'}
          >How It Works</a>
          <a
            href="#built-for-builders"
            onClick={(e) => { e.preventDefault(); scrollTo('built-for-builders'); }}
            style={{ color: activeSection === 'built-for-builders' ? '#fff' : '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: activeSection === 'built-for-builders' ? 600 : 500, transition: 'color 0.2s', pointerEvents: 'auto' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = activeSection === 'built-for-builders' ? '#fff' : '#a9a9a9'}
          >Builders</a>
          <a
            href="#models"
            onClick={(e) => { e.preventDefault(); scrollTo('models'); }}
            style={{ color: activeSection === 'models' ? '#fff' : '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: activeSection === 'models' ? 600 : 500, transition: 'color 0.2s', pointerEvents: 'auto' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = activeSection === 'models' ? '#fff' : '#a9a9a9'}
          >Models</a>
          <a
            href="#nodes"
            onClick={(e) => { e.preventDefault(); scrollTo('nodes'); }}
            style={{ color: activeSection === 'nodes' ? '#fff' : '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: activeSection === 'nodes' ? 600 : 500, transition: 'color 0.2s', pointerEvents: 'auto' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = activeSection === 'nodes' ? '#fff' : '#a9a9a9'}
          >Nodes</a>
        </div>
      )}

      {!isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate?.('auth'); }}
            style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color='#fff'}
            onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}
          >Log In</a>
          <button
            onClick={() => onNavigate?.('auth-signup')}
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
