const fs = require('fs');

let api = fs.readFileSync('frontend/src/utils/api.js', 'utf8');

if (!api.includes('facialEditGenerate')) {
  const newApi = `
export async function facialEditGenerate(params) {
  const res = await fetch(\`\${API_BASE}/api/facial-edit\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to process facial edit');
  }
  return res.json();
}
`;

  api = api + newApi;
  fs.writeFileSync('frontend/src/utils/api.js', api);
  console.log("Patched utils/api.js with facialEditGenerate");
} else {
  console.log("Already patched frontend/src/utils/api.js");
}
