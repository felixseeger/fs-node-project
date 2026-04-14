import fs from 'fs';

let content = fs.readFileSync('frontend/src/nodes/LayerEditorNode.tsx', 'utf8');

content = content.replace(/const handleAddLayer = \(\) => \{[\s\S]*?jobType: 'ltx'[\s\S]*?\}\);[\s\S]*?\};/, `const handleAddLayer = (type: 'image' | 'video' | 'audio') => {
    addLayer({
      src: '',
      type,
      from: 0,
      durationInFrames: type === 'audio' ? 300 : 120,
      zIndex: type === 'audio' ? 0 : layers.length,
      status: 'idle',
      progress: 0,
      jobType: type
    });
  };`);

const addBtnBlock = `<button 
                  onClick={handleAddLayer}
                  style={{
                    background: 'transparent',
                    color: ui.link,
                    border: \`1px solid \${ui.link}\`,
                    borderRadius: \`\${radius.sm}px\`,
                    padding: '4px 8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Layer
                </button>`;

const newAddBtnBlock = `<div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => handleAddLayer('video')}
                    style={{ background: 'transparent', color: '#14b8a6', border: '1px solid #14b8a6', borderRadius: \`\${radius.sm}px\`, padding: '4px 6px', fontSize: '10px', cursor: 'pointer' }}
                  >
                    + Video
                  </button>
                  <button 
                    onClick={() => handleAddLayer('image')}
                    style={{ background: 'transparent', color: '#ec4899', border: '1px solid #ec4899', borderRadius: \`\${radius.sm}px\`, padding: '4px 6px', fontSize: '10px', cursor: 'pointer' }}
                  >
                    + Image
                  </button>
                  <button 
                    onClick={() => handleAddLayer('audio')}
                    style={{ background: 'transparent', color: '#a855f7', border: '1px solid #a855f7', borderRadius: \`\${radius.sm}px\`, padding: '4px 6px', fontSize: '10px', cursor: 'pointer' }}
                  >
                    + Audio
                  </button>
                </div>`;

content = content.replace(addBtnBlock, newAddBtnBlock);

fs.writeFileSync('frontend/src/nodes/LayerEditorNode.tsx', content);
console.log("Patched LayerEditorNode.tsx");
