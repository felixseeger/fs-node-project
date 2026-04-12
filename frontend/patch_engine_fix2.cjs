const fs = require('fs');

const pathHook = 'src/hooks/useExecutionEngine.ts';
let hookContent = fs.readFileSync(pathHook, 'utf-8');

hookContent = hookContent.replace(
  'const engine = createExecutionEngine(engineOptions);',
  'const engine = createExecutionEngine({ ...engineOptions, uid: user?.uid });'
);

fs.writeFileSync(pathHook, hookContent, 'utf-8');
console.log('Fixed useExecutionEngine hook again');
