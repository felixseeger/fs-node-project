import fs from 'fs';
const path = 'frontend/src/nodes/RouterNode.tsx';
let code = fs.readFileSync(path, 'utf8');
code = code.replace(
  `                <input 
                  type="text" 
                  className="nodrag nopan"
                  value={out.label}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateOutputLabel(out.id, e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{
                    background: 'transparent', border: 'none', color: '#ccc', fontSize: 12, width: '100%', outline: 'none'
                  }}
                />
              <Handle`,
  `                <input 
                  type="text" 
                  className="nodrag nopan"
                  value={out.label}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateOutputLabel(out.id, e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{
                    background: 'transparent', border: 'none', color: '#ccc', fontSize: 12, width: '100%', outline: 'none'
                  }}
                />
              </div>
              <Handle`
);
fs.writeFileSync(path, code);
