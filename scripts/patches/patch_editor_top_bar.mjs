import fs from 'fs';
const path = 'frontend/src/EditorTopBar.tsx';
let code = fs.readFileSync(path, 'utf8');

// Add onShare to props interface
code = code.replace(
  '  onOpenKeyboardShortcuts?: () => void;',
  '  onOpenKeyboardShortcuts?: () => void;\n  onShare?: () => void;'
);

// Add onShare to component destructuring
code = code.replace(
  '  onOpenKeyboardShortcuts,',
  '  onOpenKeyboardShortcuts,\n  onShare,'
);

// Add Share button before "Save as Template"
const shareButton = `
          {/* Share */}
          <button
            onClick={() => onShare?.()}
            title="Share workflow"
            style={{
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 600,
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-accent)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.background = 'var(--color-accent-soft)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share
          </button>
`;

code = code.replace(
  '          {/* Save as Template */}',
  shareButton + '\n          {/* Save as Template */}'
);

fs.writeFileSync(path, code);
console.log("Patched EditorTopBar.tsx");
