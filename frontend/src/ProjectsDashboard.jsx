import { useState, useEffect } from 'react';
import { getFirebaseAuth } from './config/firebase';
import DecodeTextButton from './components/DecodeTextButton';
import ThemeToggle from './components/ThemeToggle';
import { deleteUser } from 'firebase/auth';

// Icons
const Icons = {
  Search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Help: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Folder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  Lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Workflows: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Community: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Share: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>,
  MoreVertical: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>,
  Sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
  Moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
};

// Sidebar Item Component
function SidebarItem({ icon, label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`sidebar-item ${active ? 'active' : ''}`}
    >
      <span className="sidebar-item-icon">
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{count}</span>
      )}
    </button>
  );
}

// Section Header Component
function SectionHeader({ title }) {
  return (
    <div className="sidebar-section-header">
      {title}
    </div>
  );
}

// Project Card Component
function ProjectCard({ project, onClick, onContextMenu }) {
  const title = project.name || project.title || 'Untitled';
  const updatedAt = project.updatedAt || 'Just now';
  const thumbnail = project.thumbnail;
  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => onContextMenu(e, project)}
      className="project-card"
    >
      <div
        className="project-thumbnail-container"
        style={{
          background: thumbnail ? `url(${thumbnail})` : 'var(--color-surface-hover)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!thumbnail && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24, opacity: 0.2 }}>⚡</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-faint)', fontWeight: 500 }}>Void Canvas</span>
          </div>
        )}
      </div>
      <div className="project-card-content">
        <div className="project-card-title">
          {title}
        </div>
        <div className="project-card-date">
          {updatedAt instanceof Date ? updatedAt.toLocaleDateString() : (typeof updatedAt === 'number' ? new Date(updatedAt).toLocaleDateString() : updatedAt)}
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ message }) {
  return (
    <div
      style={{
        padding: '32px 16px',
        textAlign: 'center',
        color: 'var(--color-text-faint)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'var(--font-body)'
      }}
    >
      {message}
    </div>
  );
}

// Project Context Menu Component
function ProjectContextMenu({ x, y, onClose, onAction, project }) {
  return (
    <>
      <div
        onClick={onClose}
        onContextMenu={(e) => { e.preventDefault(); onClose(); }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          background: 'transparent'
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: y,
          left: x,
          zIndex: 9999,
          width: 200,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: '6px',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.1s ease-out'
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .menu-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 8px 12px;
            background: transparent;
            border: none;
            border-radius: 6px;
            color: var(--color-text);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.1s;
            text-align: left;
          }
          .menu-item:hover {
            background: var(--color-surface-hover);
          }
          .menu-item.danger {
            color: var(--color-danger);
          }
          .menu-item.disabled {
            color: var(--color-text-muted);
            cursor: default;
          }
          .menu-item.disabled:hover {
            background: transparent;
          }
          .menu-separator {
            height: 1px;
            background: var(--border-subtle);
            margin: 4px 0;
          }
        `}</style>

        {project.deleted ? (
          <>
            <button className="menu-item" onClick={() => { onAction('restore', project); onClose(); }}>Restore</button>
            <button className="menu-item danger" onClick={() => { onAction('permanent-delete', project); onClose(); }}>Permanently Delete</button>
          </>
        ) : (
          <>
            <button className="menu-item" onClick={() => { onAction('open', project); onClose(); }}>Open</button>
            <button className="menu-item" onClick={() => { onAction('open-new-tab', project); onClose(); }}>Open in new tab</button>
            <button className="menu-item" onClick={() => { onAction('rename', project); onClose(); }}>Rename</button>
            <button className="menu-item" onClick={() => { onAction('duplicate', project); onClose(); }}>Duplicate</button>
            <button className="menu-item disabled" disabled>Remove from folder</button>
            <div className="menu-separator" />
            <button className="menu-item" onClick={() => { onAction('favorite', project); onClose(); }}>
              {project.favorite ? 'Remove from favorites' : 'Favorite'}
            </button>
            <button className="menu-item" onClick={() => { onAction('private', project); onClose(); }}>
              {project.private ? 'Make project public' : 'Make project private'}
            </button>
            <div className="menu-separator" />
            <button className="menu-item danger" onClick={() => { onAction('delete', project); onClose(); }}>Delete</button>
          </>
        )}
      </div>
    </>
  );
}

// Trash Empty State (from reference)
function TrashEmptyState({ onBack }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: 'var(--color-surface)',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          color: 'var(--color-text)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <span style={{ width: 20, height: 20 }}>{Icons.Grid}</span>
      </div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: '0 0 8px 0',
        }}
      >
        Nothing in the trash
      </h3>
      <p
        style={{
          fontSize: 14,
          color: 'var(--color-text-muted)',
          margin: '0 0 32px 0',
        }}
      >
        Recently deleted projects will appear here. Items are permanently deleted after 30 days.
      </p>
      <button
        onClick={onBack}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: '12px 24px',
          color: 'var(--color-text)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-surface-hover)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-surface)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        Back to my projects
      </button>
    </div>
  );
}

export default function ProjectsDashboard({
  projects = [],
  onCreateProject,
  onOpenProject,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
  onLogout,
  onOpenProfile,
  theme,
  setTheme
}) {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, project }
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      // Create project with the first image
      const firstFile = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        onCreateProject?.(firstFile.name.replace(/\.[^/.]+$/, ""), event.target.result);
      };
      reader.readAsDataURL(firstFile);
    }
  };

  const handleContextMenu = (e, project) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, project });
  };

  const handleContextAction = (action, project) => {
    const projectName = project.name || project.title || 'Untitled';

    switch (action) {
      case 'open':
        onOpenProject?.(project);
        break;

      case 'open-new-tab':
        // Assuming /editor is the route for opening projects
        window.open(`/editor?id=${project.id}`, '_blank');
        break;

      case 'rename': {
        const newName = prompt('Rename project:', projectName);
        if (newName && newName.trim()) {
          onUpdateProject?.(project.id, { name: newName.trim() });
        }
        break;
      }

      case 'duplicate': {
        onDuplicateProject?.(project);
        break;
      }

      case 'favorite':
        onUpdateProject?.(project.id, { favorite: !project.favorite });
        break;

      case 'private':
        onUpdateProject?.(project.id, { private: !project.private });
        break;

      case 'delete':
        if (confirm(`Move project "${projectName}" to trash?`)) {
          onUpdateProject?.(project.id, { deleted: true, deletedAt: Date.now() });
        }
        break;
      case 'restore':
        onUpdateProject?.(project.id, { deleted: false });
        break;
      case 'permanent-delete':
        if (confirm(`Permanently delete project "${projectName}"? This cannot be undone.`)) {
          onDeleteProject?.(project.id);
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
      return () => unsubscribe();
    }
  }, []);

  const userInitials = user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() ||
    user?.email?.[0].toUpperCase() || 'U';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const filteredProjects = projects.filter(p => {
    const pName = p.name || p.title || '';
    const matchesSearch = pName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeSection === 'trash') return p.deleted;
    if (p.deleted) return false; // Hide from other views

    if (activeSection === 'favorites') return p.favorite;
    if (activeSection === 'private') return p.private;
    return true;
  });


  return (
     <div
       onDragOver={handleDragOver}
       onDragLeave={handleDragLeave}
       onDrop={handleDrop}
       className="dashboard-container"
       style={{
         display: 'flex',
         height: '100vh',
         background: 'var(--color-bg)',
         color: 'var(--color-text)',
         position: 'relative',
         fontFamily: 'var(--font-body)',
         transition: 'background 0.3s ease, color 0.3s ease',
       }}
     >
      {isDragging && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--color-surface-active)',
            backdropFilter: 'blur(10px)',
            border: '2px dashed rgba(94, 231, 223, 0.3)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            className="glass-card"
            style={{
              background: 'var(--color-surface-hover)',
              backdropFilter: 'blur(20px)',
              padding: '32px 64px',
              borderRadius: 24,
              border: '1px solid var(--color-border)',
              boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🖼️</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Drop to create</div>
            <div style={{ fontSize: 15, color: 'var(--color-text-faint)', marginTop: 8 }}>Your image will start the flow</div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: 'var(--color-bg-aside)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRight: '1px solid var(--color-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
        }}
      >
        {/* User Header */}
        <div
          style={{
            padding: 16,
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              color: 'var(--color-text)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {userInitials}
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{userName}'s Workspace</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>1 Member</div>
            </div>
            <span style={{ color: 'var(--color-text-muted)' }}>{Icons.MoreVertical}</span>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div
              style={{
                marginTop: 8,
                padding: 8,
                background: 'var(--color-surface)',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
              }}
            >
              <SidebarItem icon={Icons.Settings} label="Settings" onClick={() => { onOpenProfile?.(); setShowUserMenu(false); }} />
              <SidebarItem icon={Icons.Help} label="Help & Support" onClick={() => { alert('Help & Support coming soon!'); setShowUserMenu(false); }} />
              <div style={{ height: 1, background: 'var(--color-border)', margin: '8px 0' }} />
              <SidebarItem icon={Icons.Trash} label="Delete Account" onClick={() => {
                if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
                  if (user) {
                    deleteUser(user).catch(err => {
                      console.error('Delete account error:', err);
                      alert(`Error: ${err.message}\n\nFor security reasons, you may need to log out and log back in before deleting your account.`);
                    });
                  }
                }
              }} />
              <SidebarItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>} label="Logout" onClick={onLogout} />
            </div>
          )}
        </div>

        {/* Brand */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo-light.svg" alt="Logo" style={{ height: 24, width: 'auto' }} />
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Nodespace</span>
            <span
              style={{
                padding: '2px 6px',
                background: 'var(--color-success)',
                borderRadius: 4,
                fontSize: 9,
                fontWeight: 600,
                color: 'var(--color-bg)',
              }}
            >
              New
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ padding: '0 12px' }}>
          <SidebarItem
            icon={Icons.Workflows}
            label="Workflows"
            onClick={() => setActiveSection('workflows')}
            active={activeSection === 'workflows'}
          />
          <SidebarItem
            icon={Icons.Community}
            label="Community"
            onClick={() => setActiveSection('community')}
            active={activeSection === 'community'}
          />
          <SidebarItem
            icon={Icons.Share}
            label="Shared with me"
            onClick={() => setActiveSection('shared')}
            active={activeSection === 'shared'}
          />
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {/* Favorites */}
          <SectionHeader title="Favorites" />
          <EmptyState message="No favorites yet" />

          {/* Recent Projects */}
          <SectionHeader title="Recent Projects" />
          {projects.filter(p => !p.deleted).slice(0, 3).map(p => (
            <SidebarItem
              key={p.id}
              icon={Icons.Folder}
              label={p.name || p.title || 'Untitled'}
              onClick={() => onOpenProject?.(p)}
            />
          ))}

          {/* Workspace */}
          <SectionHeader title="Workspace" />
          <SidebarItem
            icon={Icons.Grid}
            label="All Workspace"
            active={activeSection === 'all'}
            onClick={() => setActiveSection('all')}
            count={projects.filter(p => !p.deleted).length}
          />

          {/* Private */}
          <SectionHeader title="Private" />
          <SidebarItem
            icon={Icons.Lock}
            label="All Private"
            onClick={() => setActiveSection('private')}
            active={activeSection === 'private'}
          />
        </div>

        {/* Bottom Actions */}
        <div
          style={{
            padding: 12,
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            gap: 8,
          }}
        >
          <button
            onClick={() => setActiveSection('trash')}
            style={{
              flex: 1,
              padding: 8,
              background: activeSection === 'trash' ? 'var(--color-surface-active)' : 'transparent',
              border: 'none',
              borderRadius: 6,
              color: activeSection === 'trash' ? 'var(--color-text)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Trash"
          >
            <span style={{ display: 'flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
              {Icons.Trash}
            </span>
          </button>
          <button
            style={{
              flex: 1,
              padding: 8,
              background: 'transparent',
              border: 'none',
              borderRadius: 6,
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Settings"
            onClick={() => onOpenProfile?.()}
          >
            <span style={{ display: 'flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
              {Icons.Settings}
            </span>
          </button>
          <button
            style={{
              flex: 1,
              padding: 8,
              background: 'transparent',
              border: 'none',
              borderRadius: 6,
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Help"
            onClick={() => alert('Help & Support coming soon!')}
          >
            <span style={{ display: 'flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
              {Icons.Help}
            </span>
          </button>
          {/* Theme Toggle */}
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          {/* Left: New Project Button */}
          <DecodeTextButton
            onClick={() => onCreateProject()}
            variant="primary"
            startIcon={Icons.Plus}
            style={{ padding: '8px 16px', borderRadius: 8 }}
          >
            New project
          </DecodeTextButton>

          {/* Center: Search */}
          <div
            style={{
              position: 'relative',
              width: 400,
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
                color: 'var(--color-text-muted)',
              }}
            >
              {Icons.Search}
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                background: 'var(--color-input)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                color: 'var(--color-text)',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          {/* Right: Member count & Invite */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                color: 'var(--color-text-dim)',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              <span style={{ width: 14, height: 14 }}>{Icons.Users}</span>
              1
            </button>
            <button
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                color: 'var(--color-text-dim)',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Invite
            </button>
          </div>
        </header>

        {/* Projects Grid */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            {['All', 'Favorites', 'Recent', 'Shared'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab.toLowerCase())}
                style={{
                  padding: '6px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeSection === tab.toLowerCase() ? '2px solid var(--color-text)' : '2px solid transparent',
                  color: activeSection === tab.toLowerCase() ? 'var(--color-text)' : 'var(--color-text-muted)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Projects Grid or Trash View */}
          {activeSection === 'trash' && filteredProjects.length === 0 ? (
            <TrashEmptyState onBack={() => setActiveSection('all')} />
          ) : (
            <>
              {activeSection === 'trash' && filteredProjects.length > 0 && (
                <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Items in trash will be permanently deleted after 30 days.
                </div>
              )}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 20,
                }}
              >
                {filteredProjects.length === 0 ? (
                  <EmptyState message="No projects found" />
                ) : (
                  filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => onOpenProject?.(project)}
                      onContextMenu={handleContextMenu}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {contextMenu && (
            <ProjectContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              project={contextMenu.project}
              onClose={() => setContextMenu(null)}
              onAction={handleContextAction}
            />
          )}

          {filteredProjects.length === 0 && activeSection !== 'trash' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                color: 'var(--color-text-muted)',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>No projects found</div>
              <div style={{ fontSize: 13 }}>Create a new project to get started</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
