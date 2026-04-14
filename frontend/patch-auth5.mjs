import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Completely mock the user and auth state so the app renders the editor immediately.
// We also need to mock a workflow so it's loaded in the store.
content = content.replace(
  'const [currentPage, setCurrentPage] = useState<PageType>(\'landing\');',
  'const [currentPage, setCurrentPage] = useState<PageType>(\'editor\');'
);

content = content.replace(
  'const [activeWorkflowId, setActiveWorkflowId] = useState<string | undefined>(undefined);',
  'const [activeWorkflowId, setActiveWorkflowId] = useState<string | undefined>("mock-workflow-id");'
);

content = content.replace(
  /const unsubscribeAuth = \(\) => \{\};\n\s+setAuthLoading\(false\);\n\s+setIsAuthenticated\(true\);\n\s+setCurrentUserId\("testuser@nodeproject.dev"\);\n\s+setCurrentUserEmail\("testuser@nodeproject.dev"\);\n\s+initializeProfile\("testuser@nodeproject.dev", "testuser@nodeproject.dev", "Test User"\);/g,
  `const unsubscribeAuth = () => {};
      setAuthLoading(false);
      setIsAuthenticated(true);
      setCurrentUserId("john@nodeproject.dev");
      setCurrentUserEmail("john@nodeproject.dev");
      initializeProfile("john@nodeproject.dev", "john@nodeproject.dev", "John");
      
      // Inject a mock workflow so the store isn't empty!
      setWorkflows([{
        id: "mock-workflow-id",
        name: "Luma Assets Pipeline",
        nodes: [{ id: '1', type: 'imageUniversalGenerator', position: { x: 100, y: 100 }, data: { label: 'Luma Photon' } }],
        edges: [],
        sharedWith: ["sarah@nodeproject.dev"]
      }]);
      `
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx to mock everything for the screenshot");
