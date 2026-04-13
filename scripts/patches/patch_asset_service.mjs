import fs from 'fs';
const path = 'frontend/src/services/assetService.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes("import { processAssetsInObject }")) {
  code = code.replace(
    "import { getDb, isFirebaseConfigured } from '../config/firebase';",
    "import { getDb, isFirebaseConfigured } from '../config/firebase';\nimport { processAssetsInObject } from './storageService';"
  );
}

// In createAsset:
code = code.replace(
  "  const assetData = {\n    ...serializeAsset(asset),\n    userId,\n    createdAt: serverTimestamp(),",
  "  const processedAsset = await processAssetsInObject(asset, 'assets');\n\n  const assetData = {\n    ...serializeAsset(processedAsset),\n    userId,\n    createdAt: serverTimestamp(),"
);

// In updateAsset:
code = code.replace(
  "  if (updates.images !== undefined) {\n    updateData.images = JSON.parse(JSON.stringify(updates.images));\n  }",
  "  let processedUpdates = updates;\n  if (updates.images !== undefined) {\n    processedUpdates = await processAssetsInObject(updates, 'assets');\n    updateData.images = JSON.parse(JSON.stringify(processedUpdates.images));\n  }"
);

fs.writeFileSync(path, code);
console.log("Patched assetService.ts");
