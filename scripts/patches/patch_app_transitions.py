import re

with open('frontend/src/App.tsx', 'r') as f:
    content = f.read()

# 1. Replace landing
content = content.replace("""  if (!isAuthenticated || currentPage === 'landing') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content">
          <LandingPage theme={theme} setTheme={setTheme} onCreateWorkflow={handleCreateWorkflow} onDeleteWorkflows={handleDeleteWorkflows} workflows={workflows} onNavigate={handleNavigate} />
        </div>
      </div>
    );
  }""", """  if (!isAuthenticated || currentPage === 'landing') {
    return (
      <PageTransition key="landing" className="h-screen w-screen overflow-hidden">
        <div className="app-container">
          <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
          <div className="app-content">
            <LandingPage theme={theme} setTheme={setTheme} onCreateWorkflow={handleCreateWorkflow} onDeleteWorkflows={handleDeleteWorkflows} workflows={workflows} onNavigate={handleNavigate} />
          </div>
        </div>
      </PageTransition>
    );
  }""")

# 2. Replace home
content = content.replace("""  if (currentPage === 'home') {
    return (
      <>
        <ProjectsDashboard
          projects={workflows}
          communityWorkflows={communityWorkflows}
          sharedWorkflows={sharedWorkflows}
          onShareWorkflow={shareFirebaseWorkflow}
          onUnshareWorkflow={unshareFirebaseWorkflow}
          onCreateProject={(n) => handleCreateWorkflow(n || getNextBoardName())}
          onImportWorkflowFile={handleImportWorkflowFile}
          onPromptWorkflow={handlePromptWorkflow}
          onOpenProject={(p: any) => handleCreateWorkflow(p.name || p.title || '', p.id)}
          onUpdateProject={async (id, up: any) => { setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...up } : w)); if (saveFirebaseWorkflow) await saveFirebaseWorkflow(id, up); }}
          onTogglePublic={async (id, pub) => { const name = (getFirebaseAuth().currentUser?.displayName || getFirebaseAuth().currentUser?.email?.split('@')[0]) || 'User'; await toggleWorkflowPublic(id, pub, name); }}
          onDeleteProject={id => handleDeleteWorkflows([id])}
          onDuplicateProject={async (p: any) => { if (createFirebaseWorkflow) await createFirebaseWorkflow(`${p.name || p.title} (Copy)`, p.nodes || [], p.edges || []); }}
          onCloneProject={async (p: any) => { if (createFirebaseWorkflow) { const res = await createFirebaseWorkflow(`${p.name || p.title} (Cloned)`, p.nodes || [], p.edges || []); if (res) alert('Cloned successfully'); } }}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          theme={theme}
          setTheme={setTheme}
        />
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </>
    );
  }""", """  if (currentPage === 'home') {
    return (
      <PageTransition key="home" className="h-screen w-screen overflow-hidden">
        <ProjectsDashboard
          projects={workflows}
          communityWorkflows={communityWorkflows}
          sharedWorkflows={sharedWorkflows}
          onShareWorkflow={shareFirebaseWorkflow}
          onUnshareWorkflow={unshareFirebaseWorkflow}
          onCreateProject={(n) => handleCreateWorkflow(n || getNextBoardName())}
          onImportWorkflowFile={handleImportWorkflowFile}
          onPromptWorkflow={handlePromptWorkflow}
          onOpenProject={(p: any) => handleCreateWorkflow(p.name || p.title || '', p.id)}
          onUpdateProject={async (id, up: any) => { setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...up } : w)); if (saveFirebaseWorkflow) await saveFirebaseWorkflow(id, up); }}
          onTogglePublic={async (id, pub) => { const name = (getFirebaseAuth().currentUser?.displayName || getFirebaseAuth().currentUser?.email?.split('@')[0]) || 'User'; await toggleWorkflowPublic(id, pub, name); }}
          onDeleteProject={id => handleDeleteWorkflows([id])}
          onDuplicateProject={async (p: any) => { if (createFirebaseWorkflow) await createFirebaseWorkflow(`${p.name || p.title} (Copy)`, p.nodes || [], p.edges || []); }}
          onCloneProject={async (p: any) => { if (createFirebaseWorkflow) { const res = await createFirebaseWorkflow(`${p.name || p.title} (Cloned)`, p.nodes || [], p.edges || []); if (res) alert('Cloned successfully'); } }}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          theme={theme}
          setTheme={setTheme}
        />
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </PageTransition>
    );
  }""")

# 3. Replace assets
content = content.replace("""  if (currentPage === 'assets') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}><GlobalAssetVault assetsAPI={firebaseAssets} /></div>
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    );
  }""", """  if (currentPage === 'assets') {
    return (
      <PageTransition key="assets" className="h-screen w-screen overflow-hidden">
        <div className="app-container">
          <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
          <div className="app-content" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}><GlobalAssetVault assetsAPI={firebaseAssets} /></div>
          <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        </div>
      </PageTransition>
    );
  }""")

# 4. Replace workspaces
content = content.replace("""  if (currentPage === 'workspaces') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content"><WorkspacesPage onCreateWorkspace={() => setCurrentPage('home')} workspaces={[]} /></div>
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    );
  }""", """  if (currentPage === 'workspaces') {
    return (
      <PageTransition key="workspaces" className="h-screen w-screen overflow-hidden">
        <div className="app-container">
          <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
          <div className="app-content"><WorkspacesPage onCreateWorkspace={() => setCurrentPage('home')} workspaces={[]} /></div>
          <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        </div>
      </PageTransition>
    );
  }""")

# 5. Replace workflow-settings
content = content.replace("""  if (currentPage === 'workflow-settings') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content"><WorkflowSettingsPage /></div>
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    );
  }""", """  if (currentPage === 'workflow-settings') {
    return (
      <PageTransition key="workflow-settings" className="h-screen w-screen overflow-hidden">
        <div className="app-container">
          <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
          <div className="app-content"><WorkflowSettingsPage /></div>
          <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        </div>
      </PageTransition>
    );
  }""")

# 6. Replace drawflow / node-banana
content = content.replace("""  if (currentPage === 'drawflow' || currentPage === 'node-banana') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {currentPage === 'drawflow' ? <DrawflowLab /> : <NodeBananaLab />}
        </div>
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    );
  }""", """  if (currentPage === 'drawflow' || currentPage === 'node-banana') {
    return (
      <PageTransition key={currentPage} className="h-screen w-screen overflow-hidden">
        <div className="app-container">
          <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
          <div className="app-content" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {currentPage === 'drawflow' ? <DrawflowLab /> : <NodeBananaLab />}
          </div>
          <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        </div>
      </PageTransition>
    );
  }""")

# 7. Replace default return start
content = content.replace("""  return (
    <CanvasProvider value={canvasContextValue}>""", """  return (
    <PageTransition key="editor" className="h-screen w-screen overflow-hidden">
    <CanvasProvider value={canvasContextValue}>""")

# 8. Replace default return end
content = content.replace("""    </CanvasProvider>
  );
  };""", """    </CanvasProvider>
    </PageTransition>
  );
  };""")

# 9. Replace final return
content = content.replace("""  return (
    <AnimatePresence mode="wait">
      <PageTransition key={currentPage} className="h-screen w-screen overflow-hidden">
        {renderCurrentPage()}
      </PageTransition>
    </AnimatePresence>
  );""", """  return (
    <AnimatePresence mode="wait">
      {renderCurrentPage()}
    </AnimatePresence>
  );""")

with open('frontend/src/App.tsx', 'w') as f:
    f.write(content)

print("Done")
