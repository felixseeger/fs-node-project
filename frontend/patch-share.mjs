import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement = `
          setCurrentUserEmail(user.email || undefined);
          initializeProfile(user.uid, user.email || '', user.displayName || user.email?.split('@')[0] || 'User');
          
          const path = window.location.pathname;
          if (path.startsWith('/share/')) {
            const shareId = path.split('/')[2];
            if (shareId) {
               setActiveWorkflowId(shareId);
               setCurrentPage('editor');
               if (!sessionStorage.getItem(SLP_KEY)) setShowSystemLoading(true);
               // Clean up URL
               window.history.replaceState({}, '', '/');
               return; // Skip normal page logic
            }
          }
          
          setCurrentPage((prev) => (prev === 'landing' || prev.startsWith('auth-') ? 'home' : prev));
          if (!sessionStorage.getItem(SLP_KEY)) {
            setShowSystemLoading(true);
          }
`;

content = content.replace(`
          setCurrentUserEmail(user.email || undefined);
          initializeProfile(user.uid, user.email || '', user.displayName || user.email?.split('@')[0] || 'User');
          
          setCurrentPage((prev) => (prev === 'landing' || prev.startsWith('auth-') ? 'home' : prev));
          if (!sessionStorage.getItem(SLP_KEY)) {
            setShowSystemLoading(true);
          }
`, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx with /share/ routing");
