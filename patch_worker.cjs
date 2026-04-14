const fs = require('fs');
const path = 'lib/api/services/workerService.js';
let content = fs.readFileSync(path, 'utf8');

const sanitizerCode = `
function sanitizePayload(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Buffer.isBuffer(obj)) {
    return \`data:application/octet-stream;base64,\${obj.toString('base64')}\`;
  }
  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return \`data:application/octet-stream;base64,\${Buffer.from(obj.data).toString('base64')}\`;
  }
  if (typeof obj === 'function' || (obj.pipe && typeof obj.pipe === 'function')) {
    return undefined;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizePayload).filter(v => v !== undefined);
  }
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedValue = sanitizePayload(value);
      if (sanitizedValue !== undefined) {
        sanitized[key] = sanitizedValue;
      }
    }
    return sanitized;
  }
  return obj;
}
`;

if (!content.includes('sanitizePayload')) {
    content = content.replace('export const processorRegistry = new Map();', 'export const processorRegistry = new Map();\n' + sanitizerCode);
    content = content.replace('await vfxQueue.add(jobType, { jobId, jobType, payload });', 'const safePayload = sanitizePayload(payload);\n  await vfxQueue.add(jobType, { jobId, jobType, payload: safePayload });');
    fs.writeFileSync(path, content);
    console.log('Worker service patched.');
} else {
    console.log('Already patched.');
}
