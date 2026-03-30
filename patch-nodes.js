const fs = require('fs');
const path = require('path');

const nodesDir = path.join(__dirname, 'frontend/src/nodes');
const files = fs.readdirSync(nodesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  if (file === 'AutoPromptButton.jsx' || file === 'ImageToPromptNode.jsx' || file === 'ImageAnalyzerNode.jsx' || file === 'NodeShell.jsx' || file === 'ImageUploadBox.jsx') continue;

  let content = fs.readFileSync(path.join(nodesDir, file), 'utf8');

  // We only care about files that have a prompt-in target
  if (!content.includes('prompt-in') || !content.includes('getHandleColor(\'prompt-in\')')) {
    continue;
  }

  // Also needs to have some image input to generate from
  let imageKey = 'image-in';
  let localImageKey = 'localImage';

  if (content.includes('start-image-in')) {
    imageKey = 'start-image-in';
    localImageKey = 'localStartImage';
  } else if (!content.includes('image-in') && !content.includes('image_urls')) {
    // If it doesn't take an image, skip
    continue;
  }

  console.log(`Patching ${file}...`);

  // Add import
  if (!content.includes('AutoPromptButton')) {
    content = content.replace(
      "import ImageUploadBox from './ImageUploadBox';",
      "import ImageUploadBox from './ImageUploadBox';\nimport AutoPromptButton from './AutoPromptButton';"
    );
    // If ImageUploadBox wasn't there, just put it after NodeShell
    if (!content.includes('AutoPromptButton')) {
      content = content.replace(
        "import NodeShell from './NodeShell';",
        "import NodeShell from './NodeShell';\nimport AutoPromptButton from './AutoPromptButton';"
      );
    }
  }

  // Replace the extra part of the section header
  // Find: hasPromptConnection ? linkedBadges('prompt-in') : null
  const regex1 = /hasPromptConnection \? linkedBadges\('prompt-in'\) : null/g;
  if (regex1.test(content)) {
    content = content.replace(regex1, `<div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="${imageKey}" localImageKey="${localImageKey}" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>`);
  } else {
    console.warn(`  Could not find standard prompt header in ${file}`);
  }

  fs.writeFileSync(path.join(nodesDir, file), content, 'utf8');
}
console.log('Done patching.');
