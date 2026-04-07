const fs = require('fs');
let code = fs.readFileSync('frontend/src/nodes/TextElementNode.jsx', 'utf8');

code = code.replace(
  /onBlur=\{\(\) => \{\n.*\n.*\n.*\n.*\n.*\n.*\n.*\}\}/,
  `onBlur={(e) => {
                    const newHtml = contentRef.current.innerHTML;
                    setHtml(newHtml);
                    if (data.onUpdate) data.onUpdate(id, { text: newHtml });
                }}`
);
fs.writeFileSync('frontend/src/nodes/TextElementNode.jsx', code);
