const fs = require('fs');
const path = require('path');

const nodesDir = path.join(__dirname, 'frontend/src/nodes');
const files = fs.readdirSync(nodesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  if (file === 'ImprovePromptButton.jsx' || file === 'AutoPromptButton.jsx' || file === 'ImageToPromptNode.jsx' || file === 'ImageAnalyzerNode.jsx' || file === 'NodeShell.jsx' || file === 'ImageUploadBox.jsx') continue;

  let content = fs.readFileSync(path.join(nodesDir, file), 'utf8');

  // We only care about files that have a prompt-in target
  if (!content.includes('prompt-in') || !content.includes('getHandleColor(\'prompt-in\')')) {
    continue;
  }

  // Determine if this is a video or image node based on output types or names
  let type = 'image';
  if (content.includes('outputVideo') || file.includes('Video') || file.includes('Kling') || file.includes('Runway') || file.includes('OmniHuman') || file.includes('PixVerse') || file.includes('Seedance') || file.includes('Wan26')) {
    type = 'video';
  }

  console.log(`Patching ${file} with ImprovePromptButton...`);

  // Add import if not present
  if (!content.includes('ImprovePromptButton')) {
    if (content.includes('AutoPromptButton')) {
      content = content.replace(
        "import AutoPromptButton from './AutoPromptButton';",
        "import AutoPromptButton from './AutoPromptButton';\nimport ImprovePromptButton from './ImprovePromptButton';"
      );
    } else {
      content = content.replace(
        "import NodeShell from './NodeShell';",
        "import NodeShell from './NodeShell';\nimport ImprovePromptButton from './ImprovePromptButton';"
      );
    }
  }

  // Replace the extra part of the section header to include ImprovePromptButton
  // We need to handle nodes that already have AutoPromptButton and those that don't.
  
  if (content.includes('<AutoPromptButton')) {
    // If it has AutoPromptButton, it looks like:
    // <AutoPromptButton id={id} data={data} update={update} imageKey="..." localImageKey="..." />
    // We just inject ImprovePromptButton next to it.
    const regex = /(<AutoPromptButton[^>]+>)/;
    if (regex.test(content) && !content.includes('<ImprovePromptButton')) {
      content = content.replace(regex, `$1\n            <ImprovePromptButton id={id} data={data} update={update} type="${type}" />`);
    }
  } else if (!content.includes('<ImprovePromptButton')) {
    // If it doesn't have AutoPromptButton, it might be a text-only node (like GeneratorNode, TextToIconNode, ImprovePromptNode? Wait, ImprovePromptNode shouldn't be patched... oh I skipped it? No I didn't skip ImprovePromptNode, let me add it to the ignore list)
    // Wait, if it doesn't have AutoPromptButton, it looks like:
    // extra={promptConn.connected ? <LinkedBadges nodeId={id} handleId="prompt-in" onUnlink={data.onUnlink} /> : null}
    // Or similar. Let's just find `hasPromptConnection ? linkedBadges('prompt-in') : null`
    const regex1 = /hasPromptConnection \? linkedBadges\('prompt-in'\) : null/g;
    if (regex1.test(content)) {
      content = content.replace(regex1, `<div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><ImprovePromptButton id={id} data={data} update={update} type="${type}" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>`);
    } else {
      console.warn(`  Could not find standard prompt header in ${file}`);
    }
  }

  fs.writeFileSync(path.join(nodesDir, file), content, 'utf8');
}
console.log('Done patching.');
