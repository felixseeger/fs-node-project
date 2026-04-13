import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import React, { useState, useEffect, useMemo, type FC, type MouseEvent, type DragEvent } from 'react';
import { getFirebaseAuth } from '../config/firebase';
import { DecodeTextButton } from 'blue-ether';
import NewProjectModal from '../components/NewProjectModal';
import ThemeToggle from '../components/ThemeToggle';
import { deleteUser, type User } from 'firebase/auth';
import ErrorBoundary from '../ErrorBoundary';
import type { Project, ProjectsDashboardProps, ShareModalState } from './types';
import { Icons } from './icons';
import { truncate } from './utils';
import { filterProjectsForSection } from './filterProjects';
import { buildGridEmptyStateProps } from './buildGridEmptyStateProps';
import { useProjectContextAction } from './useProjectContextAction';
import { SidebarItem } from './components/SidebarItem';
import { SectionHeader } from './components/SectionHeader';
import { LogoImage } from './components/LogoImage';
import { ProjectCard } from './components/ProjectCard';
import { EmptyState } from './components/EmptyState';
import { ProjectContextMenu } from './components/ProjectContextMenu';
import { TrashEmptyState } from './components/TrashEmptyState';
import { ShareWorkflowModal } from './components/ShareWorkflowModal';

const LogoutIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const ProjectsDashboard: FC<ProjectsDashboardProps> = ({
  projects = [],
  communityWorkflows = [],
  sharedWorkflows = [],
  onShareWorkflow,
  onUnshareWorkflow,
  onCreateProject,
  onImportWorkflowFile,
  onPromptWorkflow,
  onOpenProject,
  onUpdateProject,
  onTogglePublic,
  onDeleteProject,
  onDuplicateProject,
  onCloneProject,
  onLogout,
  onOpenProfile,
  theme,
  setTheme,
}) => {
  const dashboardRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial state
    gsap.set(sidebarRef.current, { x: -50, opacity: 0 });
    gsap.set(headerRef.current, { y: -20, opacity: 0 });
    gsap.set(tabsRef.current, { y: 20, opacity: 0 });
    
    // Card elements (if any exist immediately)
    if (gridRef.current) {
      gsap.set(gridRef.current.children, { y: 30, opacity: 0, scale: 0.95 });
    }

    // Animation sequence
    tl.to(sidebarRef.current, { x: 0, opacity: 1, duration: 0.6 })
      .to(headerRef.current, { y: 0, opacity: 1, duration: 0.5 }, "-=0.4")
      .to(tabsRef.current, { y: 0, opacity: 1, duration: 0.4 }, "-=0.3");

    // Stagger cards in
    if (gridRef.current && gridRef.current.children.length > 0) {
      tl.to(gridRef.current.children, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.2)"
      }, "-=0.2");
    }
  }, { scope: dashboardRef.current || undefined });

  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; project: Project } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [shareModal, setShareModal] = useState<ShareModalState | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  const handleContextAction = useProjectContextAction({
    onOpenProject,
    onUpdateProject,
    onTogglePublic,
    onDeleteProject,
    onDuplicateProject,
    onCloneProject,
    setShareModal,
    setShareEmail,
  });

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!e.dataTransfer) return;

    let files: File[] = [];
    try {
      files = Array.from(e.dataTransfer.files).filter((f) => f && f.type && f.type.startsWith('image/'));
    } catch {
      return;
    }

    if (files.length > 0) {
      const firstFile = files[0];
      const fileName = firstFile.name || 'Untitled';
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
          onCreateProject?.(nameWithoutExt, event.target?.result as string);
        } catch (err) {
          console.error('[ProjectsDashboard] Error creating project from drop:', err);
        }
      };

      reader.onerror = () => {
        console.error('[ProjectsDashboard] FileReader failed for:', fileName);
      };

      try {
        reader.readAsDataURL(firstFile);
      } catch (err) {
        console.error('[ProjectsDashboard] Failed to read file:', err);
      }
    }
  };

  const handleContextMenu = (e: MouseEvent, project: Project) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, project });
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
      return () => unsubscribe();
    }
  }, []);

  const userInitials =
    user?.displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() ||
    user?.email?.[0].toUpperCase() ||
    'U';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const filteredProjects = useMemo(
    () =>
      filterProjectsForSection(activeSection, searchQuery, projects, communityWorkflows, sharedWorkflows),
    [activeSection, searchQuery, projects, communityWorkflows, sharedWorkflows],
  );

  const favoriteProjects = useMemo(() => projects.filter((p) => !p.deleted && p.favorite), [projects]);

  const gridEmptyStateProps = useMemo(
    () =>
      buildGridEmptyStateProps({
        activeSection,
        searchQuery,
        projects,
        onCreateProject,
        onClearSearch: () => setSearchQuery(''),
        openNewProjectModal: () => setNewProjectModalOpen(true),
      }),
    [activeSection, searchQuery, projects, onCreateProject],
  );

  return (
    <ErrorBoundary>
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
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  letterSpacing: '-0.02em',
                }}
              >
                Drop to create
              </div>
              <div style={{ fontSize: 15, color: 'var(--color-text-faint)', marginTop: 8 }}>
                Your image will start the flow
              </div>
            </div>
          </div>
        )}
        <aside
          ref={sidebarRef}
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
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LogoImage />
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                Nodespace
              </span>
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

          <div
            style={{
              padding: 16,
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <button
              type="button"
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
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface-hover)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
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
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={`${userName}'s Workspace`}
                >
                  {truncate(userName, 16)}&apos;s Workspace
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>1 Member</div>
              </div>
              <span style={{ color: 'var(--color-text-muted)' }}>{Icons.MoreVertical}</span>
            </button>

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
                <SidebarItem
                  icon={Icons.Settings}
                  label="Settings"
                  onClick={() => {
                    onOpenProfile?.();
                    setShowUserMenu(false);
                  }}
                />
                <SidebarItem
                  icon={Icons.Help}
                  label="Help & Support"
                  onClick={() => {
                    alert('Help & Support coming soon!');
                    setShowUserMenu(false);
                  }}
                />
                <div style={{ height: 1, background: 'var(--color-border)', margin: '8px 0' }} />
                <SidebarItem icon={LogoutIcon} label="Logout" onClick={() => onLogout?.()} />
              </div>
            )}
          </div>

          <div style={{ padding: '0 12px' }}>
            <SidebarItem
              icon={Icons.Workflows}
              label="My Workflows"
              onClick={() => setActiveSection('all')}
              active={activeSection === 'all' || activeSection === 'workflows'}
            />
            <SidebarItem
              icon={Icons.Community}
              label="Community"
              onClick={() => setActiveSection('community')}
              active={activeSection === 'community'}
              count={communityWorkflows.length}
            />
            <SidebarItem
              icon={Icons.Share}
              label="Shared with me"
              onClick={() => setActiveSection('shared')}
              active={activeSection === 'shared'}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
            <SectionHeader title="Favorites" />
            {favoriteProjects.length === 0 ? (
              <EmptyState compact title="No favorites yet" hint="Star a board from its menu to pin it here." />
            ) : (
              favoriteProjects.map((p) => (
                <SidebarItem
                  key={p.id}
                  icon={Icons.Folder}
                  label={p.name || p.title || 'Untitled'}
                  onClick={() => onOpenProject?.(p)}
                />
              ))
            )}

            <SectionHeader title="Recent Projects" />
            {projects
              .filter((p) => !p.deleted)
              .slice(0, 3)
              .map((p) => (
                <SidebarItem
                  key={p.id}
                  icon={Icons.Folder}
                  label={p.name || p.title || 'Untitled'}
                  onClick={() => onOpenProject?.(p)}
                />
              ))}

            <SectionHeader title="Workspace" />
            <SidebarItem
              icon={Icons.Grid}
              label="All Workspace"
              active={activeSection === 'all'}
              onClick={() => setActiveSection('all')}
              count={projects.filter((p) => !p.deleted).length}
            />

            <SectionHeader title="Private" />
            <SidebarItem
              icon={Icons.Lock}
              label="All Private"
              onClick={() => setActiveSection('private')}
              active={activeSection === 'private'}
            />
          </div>

          <div
            style={{
              padding: 12,
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex',
              gap: 8,
            }}
          >
            <button
              type="button"
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
              type="button"
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
              type="button"
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
            {setTheme && <ThemeToggle theme={theme} setTheme={setTheme} />}
          </div>
        </aside>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <header
            ref={headerRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
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
                type="button"
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

              <DecodeTextButton
                data-testid="new-project-btn"
                onClick={() => onCreateProject && setNewProjectModalOpen(true)}
                variant="primary"
                startIcon={Icons.Plus}
                style={{ padding: '8px 16px', borderRadius: 8, marginLeft: 8 }}
              >
                New Project
              </DecodeTextButton>
            </div>
          </header>



          <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
            <div ref={tabsRef} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              {['All', 'Community', 'Favorites', 'Recent', 'Shared'].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveSection(tab.toLowerCase())}
                  style={{
                    padding: '6px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom:
                      activeSection === tab.toLowerCase() ? '2px solid var(--color-text)' : '2px solid transparent',
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

            {activeSection === 'trash' && filteredProjects.length === 0 ? (
              <TrashEmptyState onBack={() => setActiveSection('all')} />
            ) : (
              <>
                {activeSection === 'trash' && filteredProjects.length > 0 && (
                  <div
                    style={{
                      marginBottom: 16,
                      fontSize: 13,
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Items in trash will be permanently deleted after 30 days.
                  </div>
                )}
                <div
                  ref={gridRef}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 20,
                  }}
                >
                  {filteredProjects.length === 0 ? (
                    <EmptyState {...gridEmptyStateProps} />
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
                user={user}
                onClose={() => setContextMenu(null)}
                onAction={handleContextAction}
              />
            )}
          </div>

          {shareModal && (
            <ShareWorkflowModal
              shareModal={shareModal}
              shareEmail={shareEmail}
              setShareEmail={setShareEmail}
              setShareModal={setShareModal}
              onShareWorkflow={onShareWorkflow}
              onUnshareWorkflow={onUnshareWorkflow}
            />
          )}

          <NewProjectModal
            isOpen={newProjectModalOpen}
            onClose={() => setNewProjectModalOpen(false)}
            onNewProject={() => {
              setNewProjectModalOpen(false);
              onCreateProject?.();
            }}
            onImportFile={(file: File) => {
              setNewProjectModalOpen(false);
              onImportWorkflowFile?.(file);
            }}
            onTemplates={() => {
              setNewProjectModalOpen(false);
              setActiveSection('community');
            }}
            onPromptSubmit={(text: string) => {
              setNewProjectModalOpen(false);
              onPromptWorkflow?.(text);
            }}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default ProjectsDashboard;
