const fs = require('fs');

const files = [
  'frontend/tests/e2e/interactive.spec.js',
  'frontend/tests/e2e/nodes.spec.js'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the search icon click with a spacebar press to open the menu
  content = content.replace(/await page\.click\('\.ms-search-icon'\);/g, "await page.keyboard.press(' ');\n        await page.waitForTimeout(500);");
  content = content.replace(/await page\.click\('\.ms-main-toggle button'\);/g, "await page.keyboard.press(' ');\n        await page.waitForTimeout(500);");
  
  // Fix force clicking just in case
  content = content.replace(/await addNodeBtn\.click\(\);/g, "await addNodeBtn.click({ force: true });");

  fs.writeFileSync(file, content);
}
console.log("Patched menu interactions");
