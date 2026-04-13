const fs = require('fs');

const file = 'frontend/src/nodes/ImageUniversalGeneratorNode.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add getFirebaseAuth import
if (!content.includes('import { getFirebaseAuth }')) {
  content = content.replace(
    "import { Handle, Position } from '@xyflow/react';",
    "import { getFirebaseAuth } from '../config/firebase';\nimport { Handle, Position } from '@xyflow/react';"
  );
}

// 2. Modify handleDownload
content = content.replace(
`  const handleDownload = useCallback(() => {
    const url = data.outputImage;
    if (!url) return;
    const isSvg = url.startsWith('data:image/svg+xml');
    const a = document.createElement('a');
    a.href = url;
    const label = (data.label || 'Generate Image').toLowerCase().replace(/\\s+/g, '-');
    a.download = \`\${label}-\${Date.now()}\${isSvg ? '.svg' : '.jpg'}\`;
    a.click();
  }, [data.outputImage, data.label]);`,
`  const handleDownload = useCallback(() => {
    const url = data.outputImage;
    if (!url) return;
    const isSvg = url.startsWith('data:image/svg+xml');
    const a = document.createElement('a');
    a.href = url;
    
    let username = 'anonymous';
    try {
      const auth = getFirebaseAuth();
      username = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'anonymous';
    } catch (err) {}
    
    const safeUser = username.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const safeModel = (data.models ? data.models.join('_') : 'auto').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const label = (data.label || 'Generate Image').toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    a.download = \`\${safeUser}-\${safeModel}-\${label}-\${Date.now()}\${isSvg ? '.svg' : '.jpg'}\`;
    a.click();
  }, [data.outputImage, data.label, data.models]);`
);

fs.writeFileSync(file, content);
