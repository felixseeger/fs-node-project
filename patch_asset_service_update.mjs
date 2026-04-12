import fs from 'fs';
const path = 'frontend/src/services/assetService.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "  const updateData = { ...updates, updatedAt: serverTimestamp() };",
  "  const processedUpdates = await processAssetsInObject(updates, 'assets');\n  const updateData = { ...processedUpdates, updatedAt: serverTimestamp() };"
);

fs.writeFileSync(path, code);
console.log("Patched updateAsset");
