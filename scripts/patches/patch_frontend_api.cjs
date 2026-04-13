const fs = require('fs');

const path = 'frontend/src/utils/api.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Add import for getFirebaseAuth
if (!code.includes("import { getFirebaseAuth }")) {
  code = `import { getFirebaseAuth } from '../config/firebase';\n` + code;
}

// 2. Add getAuthHeaders helper
const getAuthHeadersCode = `
async function getAuthHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  try {
    const auth = getFirebaseAuth();
    if (auth && auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = \`Bearer \${token}\`;
    }
  } catch (e) {
    // Firebase might not be configured, proceed without token
    console.warn("Could not get Firebase Auth token for API request");
  }
  return headers;
}
`;

if (!code.includes("async function getAuthHeaders")) {
  code = code.replace("/**\n * Generic POST helper", getAuthHeadersCode + "\n/**\n * Generic POST helper");
}

// Replace headers: { 'Content-Type': 'application/json' }
code = code.replace(
  /headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\}/g,
  "headers: await getAuthHeaders({ 'Content-Type': 'application/json' })"
);

// pollGenericStatus fetch
code = code.replace(
  /const res = await fetch\(`\$\{API_BASE\}\$\{endpoint\}\/\$\{taskId\}\$\{endpointSuffix\}`\);/g,
  "const res = await fetch(`${API_BASE}${endpoint}/${taskId}${endpointSuffix}`, { headers: await getAuthHeaders() });"
);

// getWorkflowPatterns
code = code.replace(
  /const res = await fetch\(`\$\{API_BASE\}\/api\/ai-workflow\/patterns`\);/g,
  "const res = await fetch(`${API_BASE}/api/ai-workflow/patterns`, { headers: await getAuthHeaders() });"
);

// getAINodeTypes
code = code.replace(
  /const res = await fetch\(`\$\{API_BASE\}\/api\/ai-workflow\/nodes`\);/g,
  "const res = await fetch(`${API_BASE}/api/ai-workflow/nodes`, { headers: await getAuthHeaders() });"
);

// tripoGetTask
code = code.replace(
  /const res = await fetch\(`\$\{API_BASE\}\/api\/tripo\/task\/\$\{encodeURIComponent\(taskId\)\}`\);/g,
  "const res = await fetch(`${API_BASE}/api/tripo/task/${encodeURIComponent(taskId)}`, { headers: await getAuthHeaders() });"
);

// fetchGeneratedProjectName
code = code.replace(
  /const res = await fetch\(`\$\{API_BASE\}\/api\/generate-name`\);/g,
  "const res = await fetch(`${API_BASE}/api/generate-name`, { headers: await getAuthHeaders() });"
);

// uploadImages
code = code.replace(
  /const res = await fetch\(`\$\{API_BASE\}\/api\/upload-image`, \{\s*method: 'POST',\s*body: formData,\s*\}\);/g,
  "const res = await fetch(`${API_BASE}/api/upload-image`, { method: 'POST', headers: await getAuthHeaders(), body: formData });"
);

// processVoiceInput
code = code.replace(
  /const res = await fetch\(`\$\{API_BASE\}\/api\/process-voice`, \{\s*method: 'POST',\s*body: formData,\s*\}\);/g,
  "const res = await fetch(`${API_BASE}/api/process-voice`, { method: 'POST', headers: await getAuthHeaders(), body: formData });"
);

fs.writeFileSync(path, code);
console.log("Patched api.js successfully!");
