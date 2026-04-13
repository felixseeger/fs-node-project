import fs from 'fs';

// Patch assetService.ts
let path = 'frontend/src/services/assetService.ts';
let code = fs.readFileSync(path, 'utf8');
if (!code.includes('export class AssetServiceError')) {
  code += `\nexport class AssetServiceError extends Error {\n  code: string;\n  constructor(message: string, code: string = 'UNKNOWN') {\n    super(message);\n    this.code = code;\n    this.name = 'AssetServiceError';\n  }\n}\n`;
  fs.writeFileSync(path, code);
}

// Patch shared.js
path = 'frontend/src/nodes/shared.js';
code = fs.readFileSync(path, 'utf8');
if (!code.includes('export const getHandleColor')) {
  code += `\nexport const getHandleColor = (type) => '#ccc';\n`;
  fs.writeFileSync(path, code);
}

// Ensure other missing exports are caught
if (!code.includes('export const sp =')) {
  code += `\nexport const sp = 1; export const font = 1; export const surface = 1; export const border = 1; export const radius = 1;\n`;
  fs.writeFileSync(path, code);
}
