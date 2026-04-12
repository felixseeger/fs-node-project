const fs = require('fs');

const filesToFix = [
  'patch_auth_check.js',
  'patch_image_generation.js'
];

for (const file of filesToFix) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('/* eslint-disable no-useless-escape */')) {
      content = '/* eslint-disable no-useless-escape */\n' + content;
  }
  fs.writeFileSync(file, content);
}
console.log("Fixed!");
