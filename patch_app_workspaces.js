const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Import
jsx = jsx.replace(
  /import WorkflowsPage from '\.\/WorkflowsPage';/,
  `import WorkflowsPage from './WorkflowsPage';\nimport WorkspacesPage from './WorkspacesPage';`
);

// 2. Add route condition
const routeCondition = `
  if (currentPage === 'workspaces') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
        <TopBar currentPage={currentPage} onNavigate={setCurrentPage} workflowName={null} onLogout={() => setIsAuthenticated(false)} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <WorkspacesPage
            onCreateWorkspace={(name) => {
              // Stub for creating workspace
              setCurrentPage('home');
            }}
            workspaces={[]}
          />
        </div>
      </div>
    );
  }
`;

jsx = jsx.replace(
  /if \(currentPage === 'profile'\) \{/,
  `${routeCondition}\n  if (currentPage === 'profile') {`
);

fs.writeFileSync('frontend/src/App.jsx', jsx);
console.log("Patched App.jsx for WorkspacesPage");
