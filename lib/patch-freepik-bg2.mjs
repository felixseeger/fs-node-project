import fs from 'fs';
let content = fs.readFileSync('lib/api/services/freepik.js', 'utf-8');

const oldFunc = `export async function removeBackground(image_url) {
  const formData = new URLSearchParams();
  formData.append('image_url', image_url);
  
  const response = await fetch(ENDPOINTS.REMOVE_BACKGROUND, {
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

const newFunc = `export async function removeBackground(image) {
  const formData = new FormData();

  if (image.startsWith('http')) {
    const res = await fetch(image);
    const blob = await res.blob();
    formData.append('image', blob, 'image.jpg');
  } else if (image.startsWith('data:image')) {
    const base64Data = image.split(',')[1];
    const mimeMatch = image.match(/data:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const extension = mimeType.split('/')[1] || 'jpg';
    
    // Create a Blob from base64
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    const blob = new Blob(byteArrays, { type: mimeType });
    formData.append('image', blob, \`image.\${extension}\`);
  } else {
    throw new Error('Unsupported image format. Use URL or Data URI.');
  }
  
  const response = await fetch(ENDPOINTS.REMOVE_BACKGROUND, {
    method: 'POST',
    headers: {
      'x-freepik-api-key': process.env.FREEPIK_API_KEY,
    },
    body: formData,
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('lib/api/services/freepik.js', content);
console.log("Patched background removal payload generation");
