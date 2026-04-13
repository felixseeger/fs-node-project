import fs from 'fs';
const path = 'frontend/src/nodes/RouterNode.tsx';
let code = fs.readFileSync(path, 'utf8');
code = code.replace(
  `                  style={{
                    background: 'transparent', border: 'none', color: '#ccc', fontSize: 12, width: '100%', outline: 'none'
                  }}
                />
                ...
                <button 
                onClick={addOutput}
                className="nodrag nopan"
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{
                  width: 12, height: 12, background: getHandleColor('any'),
                  border: '2px solid #1e1e1e', right: -14
                }}
              />
            </div>
          ))}
          
          <button`,
  `                  style={{
                    background: 'transparent', border: 'none', color: '#ccc', fontSize: 12, width: '100%', outline: 'none'
                  }}
                />
              <Handle
                type="source"
                position={Position.Right}
                id={out.id}
                style={{
                  width: 12, height: 12, background: getHandleColor('any'),
                  border: '2px solid #1e1e1e', right: -14
                }}
              />
            </div>
          ))}
          
          <button`
);
fs.writeFileSync(path, code);
