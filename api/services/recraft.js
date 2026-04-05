const RECRAFT_API_TOKEN = process.env.RECRAFT_API_TOKEN || process.env.RECRAFT_API_KEY;

function getHeaders(isFormData = false) {
  if (!RECRAFT_API_TOKEN) {
    throw new Error('RECRAFT_API_TOKEN environment variable is not set. Please set it in your .env file.');
  }
  const headers = {
    'Authorization': `Bearer ${RECRAFT_API_TOKEN}`
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function generateImage(params) {
  const { prompt, n, model, style, size, negative_prompt, response_format } = params;
  const body = { prompt };
  
  if (n) body.n = parseInt(n, 10);
  if (model) body.model = model;
  if (style) body.style = style;
  if (size) body.size = size;
  if (negative_prompt) body.negative_prompt = negative_prompt;
  if (response_format) body.response_format = response_format;

  const res = await fetch('https://external.api.recraft.ai/v1/images/generations', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body)
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Recraft API error: ${res.status} - ${text}`);
  }
  return res.json();
}

export async function imageToImage(params, imageBuffer, filename) {
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'application/octet-stream' });
  formData.append('image', blob, filename);
  formData.append('prompt', params.prompt);
  
  if (params.strength !== undefined) formData.append('strength', params.strength.toString());
  if (params.style) formData.append('style', params.style);
  if (params.model) formData.append('model', params.model);

  const res = await fetch('https://external.api.recraft.ai/v1/images/imageToImage', {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Recraft API error: ${res.status} - ${text}`);
  }
  return res.json();
}

export async function vectorize(imageBuffer, filename) {
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'application/octet-stream' });
  formData.append('file', blob, filename);

  const res = await fetch('https://external.api.recraft.ai/v1/images/vectorize', {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Recraft API error: ${res.status} - ${text}`);
  }
  return res.json();
}

export async function removeBackground(imageBuffer, filename) {
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'application/octet-stream' });
  formData.append('file', blob, filename);
  
  const res = await fetch('https://external.api.recraft.ai/v1/images/removeBackground', {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Recraft API error: ${res.status} - ${text}`);
  }
  return res.json();
}

export async function upscale(type, imageBuffer, filename) {
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'application/octet-stream' });
  formData.append('file', blob, filename);

  const endpoint = type === 'creative' 
    ? 'https://external.api.recraft.ai/v1/images/creativeUpscale'
    : 'https://external.api.recraft.ai/v1/images/crispUpscale';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Recraft API error: ${res.status} - ${text}`);
  }
  return res.json();
}
