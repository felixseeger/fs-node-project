const fs = require('fs');

const path = 'src/EditorTopBar.tsx';
let content = fs.readFileSync(path, 'utf-8');

if (!content.includes('import { useBilling }')) {
  content = content.replace(
    "import React, { FC, useState, useEffect } from 'react';",
    "import React, { FC, useState, useEffect } from 'react';\nimport { useBilling } from './hooks/useBilling';"
  );
}

if (!content.includes('const { balance, loading: billingLoading }')) {
  content = content.replace(
    'const [showSaveDropdown, setShowSaveDropdown] = useState(false);',
    'const [showSaveDropdown, setShowSaveDropdown] = useState(false);\n  const { balance, loading: billingLoading } = useBilling();'
  );
}

const creditBadge = `
          {/* Credit Balance */}
          <div
            title="Available Credits"
            style={{
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 600,
              background: '#1a1a1a',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: '#00FF7F',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginRight: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            {billingLoading ? '...' : balance.toLocaleString()}
          </div>
`;

if (!content.includes('{/* Credit Balance */}')) {
  content = content.replace(
    '{/* Ready status */}',
    creditBadge + '\n          {/* Ready status */}'
  );
}

fs.writeFileSync(path, content, 'utf-8');
console.log('Patched EditorTopBar.tsx');
