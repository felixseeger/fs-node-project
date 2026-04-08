const fs = require('fs');

const files = [
  'frontend/tests/e2e/fixtures.js',
  'frontend/tests/e2e/interactive.spec.js',
  'frontend/tests/e2e/nodes.spec.js'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const blankBtn = page\.locator\('text=Blank Canvas'\)\.first\(\);\s*await expect\(blankBtn\)\.toBeVisible\(\{ timeout: \d+ \}\);\s*await blankBtn\.click\(\);/g, '');
  content = content.replace(/const blankBtn = page\.locator\('text=Visual Editor'\)\.first\(\);\s*await expect\(blankBtn\)\.toBeVisible\(\{ timeout: \d+ \}\);\s*await blankBtn\.click\(\);/g, '');
  content = content.replace(/const blankBtn = page\.getByTestId\('blank-canvas-btn'\)\.first\(\);\s*await expect\(blankBtn\)\.toBeVisible\(\{ timeout: \d+ \}\);\s*await blankBtn\.click\(\);/g, '');
  fs.writeFileSync(file, content);
}
console.log("Patched test files");
