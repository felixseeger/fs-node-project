const fs = require('fs');
const file = 'frontend/src/nodes/TextElementNode.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace dangerouslySetInnerHTML with pure DOM manipulation
content = content.replace(/dangerouslySetInnerHTML=\{\{ __html: html \}\}/g, '');

content = content.replace(
  /const \[html, setHtml\] = useState\(data\.text \|\| ''\);\s*\/\/[^\n]*\n\s*useEffect\(\(\) => \{\n\s*if \(\!isEditing && data\.text !== undefined && data\.text !== html\) \{\n\s*setHtml\(data\.text\);\n\s*\}\n\s*\}, \[data\.text, isEditing\]\);/,
  `// Sync content to DOM directly
    useEffect(() => {
        if (!isEditing && data.text !== undefined && contentRef.current) {
            if (contentRef.current.innerHTML !== data.text) {
                contentRef.current.innerHTML = data.text || '';
            }
        }
    }, [data.text, isEditing]);`
);

content = content.replace(/\{!html && !isEditing &&/g, '{!data.text && !isEditing &&');

fs.writeFileSync(file, content);
console.log('Patched TextElementNode.jsx for pure DOM manipulation');
