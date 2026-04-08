const fs = require('fs');

let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Add hook import
if (!code.includes('useFirebaseTemplates')) {
  code = code.replace(
    /import \{ useFirebaseWorkflows \} from '\.\/hooks\/useFirebaseWorkflows';/,
    `import { useFirebaseWorkflows } from './hooks/useFirebaseWorkflows';\nimport { useFirebaseTemplates } from './hooks/useFirebaseTemplates';\nimport { saveTemplate as saveLocalTemplate } from './templates/templateStore';`
  );
}

// 2. Initialize hook inside App component
if (!code.includes('const firebaseTemplates = useFirebaseTemplates(currentUserId);')) {
  code = code.replace(
    /const \[showTemplateModal, setShowTemplateModal\] = useState\(false\);/,
    `const [showTemplateModal, setShowTemplateModal] = useState(false);\n  const firebaseTemplates = useFirebaseTemplates(currentUserId);`
  );
}

// 3. Update TemplateBuilderModal onCreated callback
const oldOnCreated = /onCreated=\{\(\{ template \}\) => \{\n\s*setShowTemplateModal\(false\);\n\s*\/\/[^\n]*\n\s*\}\}/;

if (code.match(oldOnCreated)) {
  code = code.replace(
    oldOnCreated,
    `onCreated={({ template }) => {
          setShowTemplateModal(false);
          // Save locally as fallback
          saveLocalTemplate(template);
          // Save to Firebase if available
          if (firebaseTemplates.create) {
            firebaseTemplates.create(template).catch(console.error);
          }
        }}`
  );
}

fs.writeFileSync('frontend/src/App.jsx', code);
console.log('Patched App.jsx with proper template saving logic');
