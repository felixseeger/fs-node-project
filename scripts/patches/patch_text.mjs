import fs from 'fs';

let content = fs.readFileSync('frontend/src/nodes/LayerEditorNode.tsx', 'utf8');

// Update handleAddLayer to support text
content = content.replace(
  /const handleAddLayer = \(type: 'image' \| 'video' \| 'audio'\) => \{/,
  "const handleAddLayer = (type: 'image' | 'video' | 'audio' | 'text') => {"
);

// Add the + Text button
const oldButtons = `<div style={{ display: 'flex', gap: '4px' }}>
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

const newButtons = `<div style={{ display: 'flex', gap: '4px' }}>
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
                  <button 
                    onClick={() => handleAddLayer('text')}
                    style={{ background: 'transparent', color: '#f97316', border: '1px solid #f97316', borderRadius: \`\${radius.sm}px\`, padding: '4px 6px', fontSize: '10px', cursor: 'pointer' }}
                  >
                    + Text
                  </button>
                </div>`;

content = content.replace(oldButtons, newButtons);
fs.writeFileSync('frontend/src/nodes/LayerEditorNode.tsx', content);
console.log("Patched LayerEditorNode.tsx with Text");

// Update LayerItem.tsx to support 'text' type editing
let itemContent = fs.readFileSync('frontend/src/components/LayerItem.tsx', 'utf8');
itemContent = itemContent.replace(
  /const isGeneratable = !layer.src || layer.src.length === 0;/,
  `const isGeneratable = layer.type !== 'text' && (!layer.src || layer.src.length === 0);
  const handleTextChange = (val: string) => {
    setPrompt(val);
    onUpdate(layer.id, { src: val, status: 'completed' });
  };
  
  useEffect(() => {
    if (layer.type === 'text' && layer.src && prompt !== layer.src) {
      setPrompt(layer.src);
    }
  }, [layer.type, layer.src]);`
);

const oldGenUI = `      {isGeneratable && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp[2], marginTop: sp[1] }}>
          <TextInput 
            value={prompt} 
            onChange={setPrompt} 
            placeholder="Enter prompt..." 
          />
          <button
            onClick={handleGenerate}
            disabled={status === 'loading'}
            style={{
              background: status === 'loading' ? surface.raised : (layer.type === 'image' ? '#ec4899' : layer.type === 'audio' ? '#a855f7' : '#14b8a6'),
              color: status === 'loading' ? text.muted : '#fff',
              border: 'none',
              borderRadius: radius.md,
              padding: '6px 12px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              fontSize: 11,
              fontWeight: 600,
              alignSelf: 'flex-start',
              transition: 'background 0.2s'
            }}
          >
            {status === 'loading' ? 'Generating...' : layer.type === 'image' ? 'Generate Image' : layer.type === 'audio' ? 'Generate Audio' : 'Generate Video'}
          </button>
        </div>
      )}`;

const newGenUI = `      {layer.type === 'text' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp[2], marginTop: sp[1] }}>
          <TextInput 
            value={prompt} 
            onChange={handleTextChange} 
            placeholder="Enter text to display..." 
          />
        </div>
      ) : isGeneratable && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp[2], marginTop: sp[1] }}>
          <TextInput 
            value={prompt} 
            onChange={setPrompt} 
            placeholder="Enter prompt..." 
          />
          <button
            onClick={handleGenerate}
            disabled={status === 'loading'}
            style={{
              background: status === 'loading' ? surface.raised : (layer.type === 'image' ? '#ec4899' : layer.type === 'audio' ? '#a855f7' : '#14b8a6'),
              color: status === 'loading' ? text.muted : '#fff',
              border: 'none',
              borderRadius: radius.md,
              padding: '6px 12px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              fontSize: 11,
              fontWeight: 600,
              alignSelf: 'flex-start',
              transition: 'background 0.2s'
            }}
          >
            {status === 'loading' ? 'Generating...' : layer.type === 'image' ? 'Generate Image' : layer.type === 'audio' ? 'Generate Audio' : 'Generate Video'}
          </button>
        </div>
      )}`;

itemContent = itemContent.replace(oldGenUI, newGenUI);
fs.writeFileSync('frontend/src/components/LayerItem.tsx', itemContent);
console.log("Patched LayerItem.tsx with Text");
