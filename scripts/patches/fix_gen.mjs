import fs from 'fs';

let content = fs.readFileSync('frontend/src/components/LayerItem.tsx', 'utf8');
content = content.replace(/const isGeneratable = layer\.type !== 'text' && \(\!layer\.src \|\| layer\.src\.length === 0\);\n  const handleTextChange = \(val: string\) => \{\n    setPrompt\(val\);\n    onUpdate\(layer\.id, \{ src: val, status: 'completed' \}\);\n  \};\n  \n  useEffect\(\(\) => \{\n    if \(layer\.type === 'text' && layer\.src && prompt !== layer\.src\) \{\n      setPrompt\(layer\.src\);\n    \}\n  \}, \[layer\.type, layer\.src\]\);\n  const isGeneratable = \!layer\.src \|\| layer\.src\.length === 0;/, 
`const isGeneratable = layer.type !== 'text' && (!layer.src || layer.src.length === 0);

  const handleTextChange = (val: string) => {
    setPrompt(val);
    onUpdate(layer.id, { src: val, status: 'completed' });
  };
  
  useEffect(() => {
    if (layer.type === 'text' && layer.src && prompt !== layer.src) {
      setPrompt(layer.src);
    }
  }, [layer.type, layer.src]);`);

fs.writeFileSync('frontend/src/components/LayerItem.tsx', content);
