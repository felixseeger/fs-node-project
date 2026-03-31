const fs = require('fs');
let code = fs.readFileSync('frontend/src/EditorTopBar.jsx', 'utf8');

if (!code.includes('TemplateBuilderModal')) {
  // Import
  code = code.replace(
    /import ApiExportModal from '\.\/ApiExportModal';/,
    `import ApiExportModal from './ApiExportModal';\nimport TemplateBuilderModal from './TemplateBuilderModal';`
  );

  // Add state
  code = code.replace(
    /const \[showApiModal, setShowApiModal\] = useState\(false\);/,
    `const [showApiModal, setShowApiModal] = useState(false);\n  const [showTemplateModal, setShowTemplateModal] = useState(false);`
  );

  // Add Component
  code = code.replace(
    /<ApiExportModal\n\s*isOpen=\{showApiModal\}\n\s*onClose=\{\(\) => setShowApiModal\(false\)\}\n\s*\/>/,
    `<ApiExportModal\n        isOpen={showApiModal}\n        onClose={() => setShowApiModal(false)}\n      />\n      <TemplateBuilderModal\n        isOpen={showTemplateModal}\n        onClose={() => setShowTemplateModal(false)}\n      />`
  );

  // Add Save as Template Button
  // Before "Save"
  const saveBtnRegex = /\{\/\* Save \*\/\}\n\s*<button\n\s*onClick=\{onSave\}/;
  code = code.replace(
    saveBtnRegex,
    `{/* Save as Template */}
          <button
            onClick={() => setShowTemplateModal(true)}
            style={{
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 600,
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 6,
              color: '#22c55e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#22c55e';
              e.currentTarget.style.background = 'rgba(34,197,94,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.background = '#1a1a1a';
            }}
          >
            Save as Template
          </button>

          {/* Save */}
          <button
            onClick={onSave}`
  );
  
  fs.writeFileSync('frontend/src/EditorTopBar.jsx', code);
  console.log("Patched EditorTopBar.jsx");
} else {
  console.log("Already patched");
}
