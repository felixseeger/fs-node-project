import fs from 'fs';
const path = 'frontend/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Add imports
if (!code.includes("import { ShareWorkflowModal }")) {
  code = code.replace(
    "import EditorTopBar from './EditorTopBar';",
    "import EditorTopBar from './EditorTopBar';\nimport { ShareWorkflowModal } from './projectsDashboard/components/ShareWorkflowModal';\nimport type { ShareModalState } from './projectsDashboard/types';"
  );
}

// Add state
if (!code.includes("const [shareModal, setShareModal]")) {
  code = code.replace(
    "const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');",
    "const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');\n  const [shareModal, setShareModal] = useState<ShareModalState | null>(null);\n  const [shareEmail, setShareEmail] = useState('');"
  );
}

// Update EditorTopBar usage
code = code.replace(
  '        onRenameProject={(n) => { if (activeWorkflowId && n) return handleRenameBoard(activeWorkflowId, n); }}',
  '        onRenameProject={(n) => { if (activeWorkflowId && n) return handleRenameBoard(activeWorkflowId, n); }}\n        onShare={() => {\n          if (activeWorkflowId) {\n            const wf = workflows.find(w => w.id === activeWorkflowId);\n            setShareModal({\n              projectId: activeWorkflowId,\n              sharedWith: wf?.sharedWith || []\n            });\n          }\n        }}'
);

// Add ShareWorkflowModal before final closing div of the main return
const modalTag = `      {shareModal && (
        <ShareWorkflowModal
          shareModal={shareModal}
          shareEmail={shareEmail}
          setShareEmail={setShareEmail}
          setShareModal={setShareModal}
          onShareWorkflow={shareFirebaseWorkflow}
          onUnshareWorkflow={unshareFirebaseWorkflow}
        />
      )}`;

// We need to find a good place to insert it. Usually before the last </div> in the main component.
// But App.tsx has multiple returns. 
// Let's find the main "currentPage === 'editor'" return or similar.
