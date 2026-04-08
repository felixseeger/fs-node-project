const fs = require('fs');
let code = fs.readFileSync('frontend/src/TemplateBuilderModal.jsx', 'utf8');

// Update to not call saveTemplate directly, but rely on onCreated
code = code.replace(
  /saveTemplate\(template\);\n\s*onCreated\?\.\(\{ template, placeOnCanvas \}\);/,
  `// saveTemplate(template); // Let parent handle saving to Firebase and/or local storage
    onCreated?.({ template, placeOnCanvas });`
);

fs.writeFileSync('frontend/src/TemplateBuilderModal.jsx', code);
console.log('Patched TemplateBuilderModal.jsx to defer saving to parent');
