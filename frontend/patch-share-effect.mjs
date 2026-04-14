import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const effect = `
  useEffect(() => {
    if (isAuthenticated && currentUserId && window.location.pathname.startsWith('/share/')) {
      const shareId = window.location.pathname.split('/')[2];
      if (shareId) {
        console.log("Loading shared workflow from URL", shareId);
        loadFirebaseWorkflow(shareId).then(fbWf => {
          if (fbWf) {
            setActiveWorkflowId(shareId);
            setNodes(fbWf.nodes || []);
            setEdges(fbWf.edges || []);
            setCurrentPage('editor');
            if (subscribe) subscribe(shareId);
            window.history.replaceState({}, '', '/');
          } else {
            console.error("Shared workflow not found or no access");
            setCurrentPage('home');
            window.history.replaceState({}, '', '/');
          }
        });
      }
    }
  }, [isAuthenticated, currentUserId, loadFirebaseWorkflow, setNodes, setEdges, subscribe]);
`;

// Insert the new effect after useFirebaseWorkflows
content = content.replace(
  '  const handleLogout = useCallback(async () => {',
  effect + '\n\n  const handleLogout = useCallback(async () => {'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx with share loading effect");
