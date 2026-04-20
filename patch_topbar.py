import sys

filepath = 'frontend/src/EditorTopBar.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Remove all inline onMouseEnter / onMouseLeave handlers and replace with a standard class
import re

# Remove the inline hover functions
content = re.sub(r'\s*onMouseEnter=\{\(e\) => \{[^}]+\}\}', '', content)
content = re.sub(r'\s*onMouseLeave=\{\(e\) => \{[^}]+\}\}', '', content)

# 2. Re-arrange and restyle the components
# We want to group things:
# Left: Title/Settings
# Middle: Status
# Right: Public/Private, Share, Collab, API, Recipes, Menu (Import/Export/Shortcuts), Save

# Let's replace the main return block
old_return_block = content[content.find('  return ('):content.rfind('  );') + 4]

new_return_block = """  return (
    <>
      <ProjectSettingsModal
        isOpen={showProjectSettings}
        onClose={() => setShowProjectSettings(false)}
        initialProjectName={projectName}
        onRenameProject={onRenameProject || (() => {})}
      />
      <ApiExportModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        nodes={nodes}
        edges={edges}
        workflowId={workflowId}
      />

      <div
        style={{
          height: 56,
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}
      >
        {/* Left side: Project Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => setShowProjectSettings(true)}
            className="topbar-btn ghost"
            title="Project settings"
            style={{
              padding: '6px 10px',
              fontSize: 14,
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderRadius: 6,
              color: 'var(--color-text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {projectName || 'Untitled Project'}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden style={{ opacity: 0.5 }}>
              <path
                d="M8 10a2 2 0 100-4 2 2 0 000 4z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.6 9.9l-.3 1.7 1.5 1.5-1.7 1.7-1.9-.8a6.5 6.5 0 01-2.2 0l-1.9.8-1.7-1.7 1.5-1.5-.3-1.7a6.4 6.4 0 010-1.8l.3-1.7L2.5 6.6l1.7-1.7 1.9.8c.7-.4 1.4-.7 2.2-.8l.3-1.9h2.4l.3 1.9c.8.1 1.5.4 2.2.8l1.9-.8 1.7 1.7-1.5 1.5.3 1.7c.1.6.1 1.2 0 1.8z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          <div style={{ width: 1, height: 16, background: 'var(--color-border)' }} />
          
          {/* Ready status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)' }} />
            <span style={{ fontSize: 12, color: 'var(--color-text-dim)', fontWeight: 500 }}>Ready</span>
          </div>
        </div>

        {/* Right side items container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          
          {/* Tools Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingRight: 12, borderRight: '1px solid var(--color-border)' }}>
            <button
              className="topbar-btn ghost"
              onClick={() => onOpenRecipes?.()}
              title="Prompt Recipes"
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                background: 'transparent',
                border: 'none',
                borderRadius: 6,
                color: 'var(--color-text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              Recipes
            </button>

            <button
              className="topbar-btn ghost"
              onClick={() => {
                setShowApiModal(true);
                if (onApiExport) onApiExport();
              }}
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                background: 'transparent',
                border: 'none',
                borderRadius: 6,
                color: 'var(--color-text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 4L1 8L3.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.5 4L15 8L12.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.5 3L6.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              API
            </button>
          </div>

          {/* Collaboration Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingRight: 12, borderRight: '1px solid var(--color-border)' }}>
            <button
              className="topbar-btn ghost"
              onClick={() => onTogglePublic?.(!isPublic)}
              title={isPublic ? "Make board private" : "Make board public"}
              style={{
                padding: '6px 10px',
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                background: isPublic ? 'var(--color-accent-soft)' : 'transparent',
                border: 'none',
                borderRadius: 6,
                color: isPublic ? 'var(--color-accent)' : 'var(--color-text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {isPublic ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              )}
              {isPublic ? 'Public' : 'Private'}
            </button>

            <button
              className="topbar-btn ghost"
              onClick={() => onToggleCollaboration?.()}
              title="Open Collaboration Hub"
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                background: 'transparent',
                border: 'none',
                borderRadius: 6,
                color: 'var(--color-text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Collab
            </button>

            <button
              className="topbar-btn ghost"
              onClick={() => onShare?.()}
              title="Share workflow"
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                background: 'transparent',
                border: 'none',
                borderRadius: 6,
                color: 'var(--color-text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
          </div>

          {/* Data & Actions Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            
            {/* Primary Action */}
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <div style={{ display: 'flex' }}>
                <button
                  className="topbar-btn primary"
                  onClick={onSave}
                  style={{
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    background: 'var(--color-accent)',
                    border: 'none',
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.5 15H2.5C1.67 15 1 14.33 1 13.5V2.5C1 1.67 1.67 1 2.5 1H11L15 5V13.5C15 14.33 14.33 15 13.5 15Z"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <path d="M11 1V5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 9H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M4 11.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Save
                </button>
                <button
                  className="topbar-btn primary-dropdown"
                  onClick={() => setShowSaveDropdown(!showSaveDropdown)}
                  style={{
                    padding: '8px 6px',
                    background: 'var(--color-accent)',
                    border: 'none',
                    borderLeft: '1px solid rgba(0,0,0,0.2)',
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              
              {/* Dropdown for Advanced Options (Save Embedded + JSON) */}
              {showSaveDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  width: 240,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  zIndex: 1200,
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <button
                    className="topbar-menu-item"
                    onClick={() => {
                      setShowSaveDropdown(false);
                      if (onSaveWithEmbeddedWorkflow) onSaveWithEmbeddedWorkflow();
                    }}
                    style={{
                      width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
                      color: 'var(--color-text)', fontSize: 13, padding: '8px 12px', borderRadius: 4,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2L14 8L8 14L2 8L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 6L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Save Embedded Workflow
                  </button>
                  
                  <div style={{ height: 1, background: 'var(--color-border)', margin: '4px 0' }} />

                  {onImportJSON && (
                    <button
                      className="topbar-menu-item"
                      onClick={() => {
                        setShowSaveDropdown(false);
                        onImportJSON();
                      }}
                      style={{
                        width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
                        color: 'var(--color-text-dim)', fontSize: 13, padding: '8px 12px', borderRadius: 4,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M4.5 7.5L8 11L11.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Import JSON
                    </button>
                  )}

                  {onExportJSON && (
                    <button
                      className="topbar-menu-item"
                      onClick={() => {
                        setShowSaveDropdown(false);
                        onExportJSON();
                      }}
                      style={{
                        width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
                        color: 'var(--color-text-dim)', fontSize: 13, padding: '8px 12px', borderRadius: 4,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M8 11V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M4.5 5.5L8 2L11.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Export JSON
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts */}
            <button
              className="topbar-btn ghost"
              onClick={onOpenKeyboardShortcuts}
              title="Keyboard Shortcuts (Cmd/Cmd+.)"
              style={{
                padding: '6px',
                fontSize: 12,
                background: 'transparent',
                border: 'none',
                borderRadius: 6,
                color: 'var(--color-text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="6" width="12" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 10H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M13 10H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M5 12L4 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M11 12L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Global styles for hover effects replacing inline handlers */}
      <style>{`
        .topbar-btn.ghost {
          transition: background-color 0.2s, color 0.2s;
        }
        .topbar-btn.ghost:hover {
          background-color: var(--color-surface-hover);
          color: var(--color-text-strong, #fff);
        }
        .topbar-btn.primary:hover, .topbar-btn.primary-dropdown:hover {
          filter: brightness(1.1);
        }
        .topbar-menu-item:hover {
          background-color: var(--color-surface-hover) !important;
          color: var(--color-text-strong, #fff) !important;
        }
      `}</style>
    </>
  );"""

if old_return_block in content:
    content = content.replace(old_return_block, new_return_block)
    with open(filepath, 'w') as f:
        f.write(content)
    print("Successfully replaced block")
else:
    print("Could not find the block to replace!")
    sys.exit(1)
