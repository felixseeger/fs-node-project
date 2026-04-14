import fs from 'fs';
let content = fs.readFileSync('lib/api/services/freepik.js', 'utf-8');

const oldRecraft = `export async function recraftRemoveBackground(params) {
  const { image_url } = params;
  
  const formData = new URLSearchParams();
  formData.append('image_url', image_url);
  
  const response = await fetch(ENDPOINTS.RECRAFT_REMOVE_BACKGROUND, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-freepik-api-key': process.env.FREEPIK_API_KEY,
    },
    body: formData.toString(),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}`;

// I need to find the correct Recraft implementation and patch it too.
