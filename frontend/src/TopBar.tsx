import { useState, useRef, useEffect, FC } from 'react';
import { Avatar } from 'blue-ether';

interface MenuItem {
  id: string;
  label?: string;
  icon?: string;
  type?: 'divider';
  shortcut?: string;
}

interface TopBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  workflowName?: string;
  editorMode?: 'interface' | 'node-editor';
  onEditorModeChange?: (mode: 'interface' | 'node-editor') => void;
  onLogout?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomFit?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onRename?: () => void;
  onDuplicate?: () => void;
  isLocked?: boolean;
  onLockView?: () => void;
  onOpenProfile?: () => void;
  isAuthenticated: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
  }

  export const TopBar: FC<TopBarProps> = ({
  currentPage,
  onNavigate,
  workflowName,
  editorMode,
  onEditorModeChange,
  onLogout,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onUndo,
  onRedo,
  onRename,
  onDuplicate,
  isLocked,
  onLockView,
  onOpenProfile,
  isAuthenticated,
  setIsMobileMenuOpen = () => {},
  }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultMenuItems: MenuItem[] = [
    { id: 'landing', label: 'Landing page', icon: '&#8962;' }, // House icon
    { id: 'workspaces', label: 'Workspaces', icon: '&#9864;' },
    { id: 'home', label: 'Back home', icon: '&#9776;' },
    { id: 'editor', label: 'New Workflow', icon: '&#43;' },
    { id: 'divider-1', type: 'divider' },
    { id: 'assets', label: 'Global Assets', icon: '&#128193;' },
    { id: 'workflow-settings', label: 'Workflow Settings', icon: '&#9881;' },
    { id: 'drawflow', label: 'Drawflow lab', icon: '&#8801;' },
    { id: 'node-banana', label: 'Node Banana (AI)', icon: '&#127820;' },
    { id: 'profile', label: 'Profile', icon: '&#9786;' },
    { id: 'divider-2', type: 'divider' },
    { id: 'logout', label: 'Sign Out', icon: '&#10140;' },
  ];

  const editorMenuItems: MenuItem[] = [
    { id: 'landing', label: 'Landing page' },
    { id: 'home', label: 'Back home' },
    { id: 'profile', label: 'My profile' },
    { id: 'divider-1', type: 'divider' },
    { id: 'editor', label: 'New board' },
    { id: 'duplicate-project', label: 'Duplicate board' },
    { id: 'rename-project', label: 'Rename board' },
    { id: 'undo', label: 'Undo', shortcut: '⌘Z' },
    { id: 'redo', label: 'Redo', shortcut: '⌘⇧Z' },
    { id: 'divider-2', type: 'divider' },
    { id: 'assets', label: 'Global Assets' },
    { id: 'workflow-settings', label: 'Board settings' },
    { id: 'drawflow', label: 'Drawflow lab' },
    { id: 'node-banana', label: 'Node Banana (AI)' },
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
        background: 'transparent',
        borderBottom: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        position: 'relative',
        color: 'var(--color-text)',
        zIndex: 1300,
        pointerEvents: currentPage === 'landing' ? 'none' : 'auto'
      }}
    >
      {/* Left — Logo + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: currentPage === 'home' ? 40 : 0, pointerEvents: 'auto' }}>
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
                gap: 8,
                transition: 'background 0.15s',
                ...(hovered === 'logo' || menuOpen ? { background: 'var(--color-surface-hover)' } : {}),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/logo-light.svg" alt="Logo" style={{ height: 24, width: 'auto' }} />
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Nodespace</span>
              </div>
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
            <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo-light.svg" alt="Logo" style={{ height: 24, width: 'auto' }} />
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Nodespace</span>
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
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                padding: 4,
                minWidth: 180,
                boxShadow: 'var(--shadow-default)',
                zIndex: 10001,
              }}
            >
              {menuItems.map((item) =>
                item.type === 'divider' ? (
                  <div
                    key={item.id}
                    style={{
                      height: 1,
                      background: 'var(--color-border)',
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
                      background: hovered === `menu-${item.id}` ? 'var(--color-surface-hover)' : 'transparent',
                      border: 'none',
                      borderRadius: 7,
                      color: item.id === 'logout'
                        ? (hovered === `menu-${item.id}` ? '#f87171' : 'var(--color-text-dim)')
                        : currentPage === item.id ? 'var(--color-text)' : 'var(--color-text-dim)',
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
                      {item.shortcut && <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>{item.shortcut}</span>}
                    </span>
                  </button>
                )
              )}
            </div>
          )}
        </div>



        {isAuthenticated && currentPage === 'home' && (
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('workspaces'); }} style={{ color: 'var(--color-text-dim)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-dim)'}>Workflows</a>
            <a href="#" style={{ color: 'var(--color-text-dim)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-dim)'}>Templates</a>
          </div>
        )}




        {/* Workflow name (only in editor) */}
        {currentPage === 'editor' && workflowName && (
          <>
            <span style={{ color: 'var(--color-border)', margin: '0 12px', fontSize: 14, userSelect: 'none' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>
              {workflowName}
            </span>
          </>
        )}
      </div>

      {/* Center Nav — absolutely centered on X */}
      {/* Center Nav removed by user request */}




      {/* Right side for Authenticated Users */}
      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, pointerEvents: 'auto' }}>
          {/* ThemeToggle removed by user request */}


          {currentPage === 'editor' && (
            <div style={{
              display: window.innerWidth < 768 ? 'none' : 'flex',
              alignItems: 'center',
              background: 'var(--color-surface)',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
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
                  background: editorMode === 'interface' ? 'var(--color-surface-hover)' : 'transparent',
                  color: editorMode === 'interface' ? 'var(--color-text)' : 'var(--color-text-dim)',
                  ...(hovered === 'interface' && editorMode !== 'interface' ? { color: 'var(--color-text)' } : {}),
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
                  background: editorMode === 'node-editor' ? 'var(--color-surface-hover)' : 'transparent',
                  color: editorMode === 'node-editor' ? 'var(--color-text)' : 'var(--color-text-dim)',
                  ...(hovered === 'node-editor' && editorMode !== 'node-editor' ? { color: 'var(--color-text)' } : {}),
                }}
              >
                Node Editor
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onOpenProfile}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Account"
          >
            <Avatar initials="U" size="sm" crt alt="Account" />
          </button>

          {/* Hamburger Menu (Mobile Only - Auth) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            style={{
              display: window.innerWidth < 768 ? 'flex' : 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text)',
              fontSize: 24,
              cursor: 'pointer',
              padding: 8,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &#9776;
          </button>
        </div>
      )}
    </div>
  );
};

export default TopBar;
