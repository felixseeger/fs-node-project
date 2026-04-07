const fs = require('fs');
let code = fs.readFileSync('frontend/src/nodes/TextElementNode.jsx', 'utf8');

code = code.replace(
  /useEffect\(\(\) => \{\n        if \(\!isEditing\) \{\n.*\n        \}\n    \}, \[data\.text, isEditing\]\);/,
  `useEffect(() => {
        if (!isEditing && data.text) {
            // Only update html from server if it differs significantly from our local state
            if (contentRef.current && contentRef.current.innerHTML !== data.text) {
                setHtml(data.text);
            } else if (!contentRef.current && data.text !== html) {
                setHtml(data.text);
            }
        }
    }, [data.text, isEditing]);`
);
fs.writeFileSync('frontend/src/nodes/TextElementNode.jsx', code);
