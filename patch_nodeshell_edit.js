const fs = require('fs');
let jsx = fs.readFileSync('frontend/src/nodes/NodeShell.jsx', 'utf8');

// Add onEdit to props
jsx = jsx.replace(
  /export default function NodeShell\(\{ label, dotColor, selected, children, onDisconnect \}\) \{/,
  `export default function NodeShell({ label, dotColor, selected, children, onDisconnect, onEdit }) {`
);

// Add the Edit button before the Disconnect button
const editBtn = `
        <div style={{ display: 'flex', gap: 4 }}>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title="Edit Element"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: 14,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          )}
          {onDisconnect && (`;

jsx = jsx.replace(/\{onDisconnect && \(/, editBtn);

// Close the div we opened around the buttons
jsx = jsx.replace(
  /<\/svg>\n\s*<\/button>\n\s*\)}\n\s*<\/div>/,
  `</svg>\n          </button>\n        )}\n        </div>\n      </div>`
);

fs.writeFileSync('frontend/src/nodes/NodeShell.jsx', jsx);
console.log("Patched NodeShell.jsx with onEdit");
