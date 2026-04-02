const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/nodes/LayerEditorNode.jsx', 'utf8');

// 1. Add useNodeConnections and getHandleColor
jsx = jsx.replace(
  /import \{ NodeResizer \} from '@xyflow\/react';/,
  `import { NodeResizer, Handle, Position } from '@xyflow/react';\nimport useNodeConnections from './useNodeConnections';\nimport { getHandleColor } from '../utils/handleTypes';`
);

// 2. Add hook to component
jsx = jsx.replace(
  /const \[dimensions, setDimensions\] = useState\(\{ width: 2048, height: 2048 \}\);/,
  `const { resolve, disconnectNode } = useNodeConnections(id, data);\n  const [dimensions, setDimensions] = useState({ width: 2048, height: 2048 });\n\n  const bgImage = resolve.image('image-in')?.[0];`
);

// 3. Add Handles and render bgImage
const oldCanvasDiv = /<div style=\{\{\s*width: dimensions\.width, \s*height: dimensions\.height, \s*minWidth: 256,\s*minHeight: 256,\s*backgroundColor: '#0a0a0a',\s*border: `2px solid \$\{selected \? '#3b82f6' : '#333'\}`,\s*borderRadius: 8,\s*display: 'flex',\s*alignItems: 'center',\s*justifyContent: 'center',\s*overflow: 'hidden',\s*position: 'relative'\s*\}\}>/;

const newCanvasDiv = `<div style={{ 
        width: dimensions.width, 
        height: dimensions.height, 
        minWidth: 256,
        minHeight: 256,
        backgroundColor: '#0a0a0a', 
        border: \`2px solid \${selected ? '#3b82f6' : '#333'}\`,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Handle type="target" position={Position.Left} id="image-in" style={{ width: 14, height: 14, background: getHandleColor('image'), border: '2px solid #1a1a1a', left: -8, zIndex: 10 }} />
        <Handle type="source" position={Position.Right} id="image-out" style={{ width: 14, height: 14, background: getHandleColor('image'), border: '2px solid #1a1a1a', right: -8, zIndex: 10 }} />
`;

jsx = jsx.replace(oldCanvasDiv, newCanvasDiv);

const oldCheckerboard = /<div style=\{\{\s*position: 'absolute',\s*inset: 0,\s*opacity: 0\.1,\s*backgroundImage: 'linear-gradient\(45deg, #808080 25%, transparent 25%\), linear-gradient\(-45deg, #808080 25%, transparent 25%\), linear-gradient\(45deg, transparent 75%, #808080 75%\), linear-gradient\(-45deg, transparent 75%, #808080 75%\)',\s*backgroundSize: '20px 20px',\s*backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'\s*\}\} \/>\s*<span style=\{\{ color: '#555', fontSize: 14, fontWeight: 500, zIndex: 1 \}\}>Canvas \{dimensions\.width\}x\{dimensions\.height\}<\/span>/;

const newCheckerboard = `<div style={{
          position: 'absolute',
          inset: 0,
          opacity: bgImage ? 0 : 0.1,
          backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }} />
        {bgImage && (
          <img src={bgImage} alt="Canvas Background" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 0 }} />
        )}
        <span style={{ color: '#555', fontSize: 14, fontWeight: 500, zIndex: 1, textShadow: bgImage ? '0 1px 4px rgba(0,0,0,0.8)' : 'none' }}>
          {bgImage ? '' : \`Canvas \${dimensions.width}x\${dimensions.height}\`}
        </span>`;

jsx = jsx.replace(oldCheckerboard, newCheckerboard);

// In LayerEditorMenu, add a "Disconnect" option? Actually, onDisconnect is passed to NodeShell usually, but LayerEditorNode doesn't use NodeShell.
// Let's add a quick disconnect button manually to the menu header.
jsx = jsx.replace(
  /<button onClick=\{onClose\}/,
  `{onDisconnect && (
            <button onClick={onDisconnect} title="Disconnect" style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '4px', marginRight: '4px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.84 9.42l-1.42 1.42a4 4 0 1 1-5.66-5.66l1.42-1.42"></path><path d="M5.16 14.58l1.42-1.42a4 4 0 0 1 5.66 5.66l-1.42 1.42"></path><line x1="8" y1="16" x2="16" y2="8"></line></svg>
            </button>
          )}
          <button onClick={onClose}`
);

// We need to pass onDisconnect to LayerEditorMenu
jsx = jsx.replace(
  /function LayerEditorMenu\(\{ width, height, isLinked \}\) \{/,
  `function LayerEditorMenu({ width, height, isLinked, onClose, onDisconnect }) {`
);

jsx = jsx.replace(
  /<LayerEditorMenu width=\{dimensions\.width\} height=\{dimensions\.height\} isLinked=\{true\} \/>/,
  `<LayerEditorMenu width={dimensions.width} height={dimensions.height} isLinked={true} onDisconnect={disconnectNode} />`
);

fs.writeFileSync('frontend/src/nodes/LayerEditorNode.jsx', jsx);
console.log("Patched LayerEditorNode.jsx");
