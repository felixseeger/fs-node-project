import fs from 'fs';
const path = 'frontend/src/services/historyService.js';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('import { uploadAssetToStorage }')) {
  code = "import { uploadAssetToStorage } from './storageService';\n" + code;
}

code = code.replace(
  "export function addToHistory(item) {",
  "export async function addToHistory(item) {\n  if (item.url && (item.url.startsWith('data:') || item.url.startsWith('blob:'))) {\n    try {\n      item.url = await uploadAssetToStorage(item.url, 'history');\n    } catch (e) {\n      console.error('Failed to upload history item to storage', e);\n    }\n  }"
);

fs.writeFileSync(path, code);
console.log("Patched historyService.js");
