const fs = require('fs');
let code = fs.readFileSync('frontend/eslint.config.js', 'utf8');

if (!code.includes('ignores:')) {
  code = code.replace(
    /export default \[/,
    `export default [\n  { ignores: ['**/*.js', '**/*.cjs', '**/*.mjs'] },`
  );
}

fs.writeFileSync('frontend/eslint.config.js', code);
console.log('Patched eslint.config.js ignores');
