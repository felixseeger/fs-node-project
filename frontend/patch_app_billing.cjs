const fs = require('fs');

// Patch App.tsx to pass currentUserId
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

appContent = appContent.replace(
  '<EditorTopBar\n',
  '<EditorTopBar\n            currentUserId={currentUserId}\n'
);
// If it's on the same line
appContent = appContent.replace(
  '<EditorTopBar isPublic=',
  '<EditorTopBar currentUserId={currentUserId} isPublic='
);

fs.writeFileSync('src/App.tsx', appContent, 'utf-8');

// Patch EditorTopBar.tsx to accept currentUserId
let topBarContent = fs.readFileSync('src/EditorTopBar.tsx', 'utf-8');
if (!topBarContent.includes('currentUserId?: string;')) {
  topBarContent = topBarContent.replace(
    'interface EditorTopBarProps {',
    'interface EditorTopBarProps {\n  currentUserId?: string;'
  );
  topBarContent = topBarContent.replace(
    'workflowId,',
    'workflowId,\n  currentUserId,'
  );
  topBarContent = topBarContent.replace(
    'useBilling();',
    'useBilling(currentUserId);'
  );
  fs.writeFileSync('src/EditorTopBar.tsx', topBarContent, 'utf-8');
}

// Patch ProfileModal.tsx
let profileContent = fs.readFileSync('src/ProfileModal.tsx', 'utf-8');
profileContent = profileContent.replace(
  'const { balance, transactions, loading: billingLoading } = useBilling();',
  'const { balance, transactions, loading: billingLoading } = useBilling(user?.uid || null);'
);
fs.writeFileSync('src/ProfileModal.tsx', profileContent, 'utf-8');
console.log('Patched App, EditorTopBar, and ProfileModal for billing context');
