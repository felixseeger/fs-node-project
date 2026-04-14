import fs from 'fs';
let content = fs.readFileSync('frontend/src/components/LayerItem.tsx', 'utf8');

content = content.replace("const isGeneratable = !layer.src || layer.src.length === 0;", "");

fs.writeFileSync('frontend/src/components/LayerItem.tsx', content);
