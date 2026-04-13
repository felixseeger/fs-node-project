const fs = require('fs');

const file = 'frontend/src/nodes/VideoUniversalGeneratorNode.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add getFirebaseAuth import
content = content.replace(
  "import { Handle, Position } from '@xyflow/react';",
  "import { getFirebaseAuth } from '../config/firebase';\nimport { Handle, Position } from '@xyflow/react';"
);

// 2. Modify handleDownload
content = content.replace(
`  const handleDownload = useCallback(() => {
    const url = data.outputVideo;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    const label = (data.label || 'Generate Video').toLowerCase().replace(/\\s+/g, '-');
    a.download = \`\${label}-\${Date.now()}.mp4\`;
    a.click();
  }, [data.outputVideo, data.label]);`,
`  const handleDownload = useCallback(() => {
    const url = data.outputVideo;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    
    let username = 'anonymous';
    try {
      const auth = getFirebaseAuth();
      username = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'anonymous';
    } catch (err) {}
    
    const safeUser = username.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const safeModel = (data.models ? data.models.join('_') : 'auto').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const label = (data.label || 'Generate Video').toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    a.download = \`\${safeUser}-\${safeModel}-\${label}-\${Date.now()}.mp4\`;
    a.click();
  }, [data.outputVideo, data.label, data.models]);`
);

// 3. Add modelName to BaseNode
content = content.replace(
`      downloadUrl={data.outputVideo}
      downloadType="video"
      settingsExpanded={true}`,
`      downloadUrl={data.outputVideo}
      downloadType="video"
      modelName={data.models ? data.models.join('_') : 'auto'}
      settingsExpanded={true}`
);

fs.writeFileSync(file, content);
