const fs = require('fs');

let server = fs.readFileSync('api/server.js', 'utf8');

// Replace group-edit endpoint
const oldGroupEdit = `// ── Group Editing Mock Route ──
app.post('/api/group-edit', async (req, res) => {
  const { images, subjectPrompt, editPrompt, useVGGT, denoising } = req.body;
  if (!images || images.length === 0) {
    return res.status(400).json({ error: 'No images provided' });
  }
  
  try {
    // Simulated processing delay for the Wan-VACE model + VGGT extraction
    await new Promise(r => setTimeout(r, 4000));
    
    // Mock: just return the input images back to the user
    // In production, this would send the Base64 to a RunPod/Modal worker
    // running the DiffSynth-Studio GroupEditing Python pipeline.
    res.json({ images });
  } catch (err) {
    console.error('GroupEdit error:', err);
    res.status(500).json({ error: err.message });
  }
});`;

const newGroupEdit = `// ── Group Editing Route (GPU Worker) ──
app.post('/api/group-edit', async (req, res) => {
  const { images, subjectPrompt, editPrompt, useVGGT, denoising } = req.body;
  if (!images || images.length === 0) {
    return res.status(400).json({ error: 'No images provided' });
  }

  const gpuEndpoint = process.env.GPU_WORKER_URL;
  const gpuApiKey = process.env.GPU_WORKER_API_KEY;

  try {
    if (!gpuEndpoint) {
      // Fallback to mock if no GPU endpoint is configured
      console.log("No GPU_WORKER_URL configured. Using mock group-edit.");
      await new Promise(r => setTimeout(r, 4000));
      return res.json({ images });
    }

    const response = await fetch(\`\${gpuEndpoint}/api/group-edit\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(gpuApiKey ? { 'Authorization': \`Bearer \${gpuApiKey}\` } : {})
      },
      body: JSON.stringify({ images, subjectPrompt, editPrompt, useVGGT, denoising }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || \`GPU worker responded with \${response.status}\`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('GroupEdit error:', err);
    res.status(500).json({ error: err.message });
  }
});`;

// Replace facial-edit endpoint
const oldFacialEdit = `// ── Facial Editing (PixelSmile) Mock Route ──
app.post('/api/facial-edit', async (req, res) => {
  const { image, emotion, intensity, strictIdentity, maskFace } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }
  
  try {
    // Simulated processing delay for Qwen-Image-Edit-2511 + PixelSmile LoRA
    await new Promise(r => setTimeout(r, 3000));
    
    // Mock: return the input image back to the user.
    // In production, this would hit a RunPod/Modal GPU instance running PixelSmile.
    res.json({ image });
  } catch (err) {
    console.error('FacialEdit error:', err);
    res.status(500).json({ error: err.message });
  }
});`;

const newFacialEdit = `// ── Facial Editing Route (GPU Worker) ──
app.post('/api/facial-edit', async (req, res) => {
  const { image, emotion, intensity, strictIdentity, maskFace } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const gpuEndpoint = process.env.GPU_WORKER_URL;
  const gpuApiKey = process.env.GPU_WORKER_API_KEY;

  try {
    if (!gpuEndpoint) {
      // Fallback to mock if no GPU endpoint is configured
      console.log("No GPU_WORKER_URL configured. Using mock facial-edit.");
      await new Promise(r => setTimeout(r, 3000));
      return res.json({ image });
    }

    const response = await fetch(\`\${gpuEndpoint}/api/facial-edit\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(gpuApiKey ? { 'Authorization': \`Bearer \${gpuApiKey}\` } : {})
      },
      body: JSON.stringify({ image, emotion, intensity, strictIdentity, maskFace }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || \`GPU worker responded with \${response.status}\`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('FacialEdit error:', err);
    res.status(500).json({ error: err.message });
  }
});`;

server = server.replace(oldGroupEdit, newGroupEdit);
server = server.replace(oldFacialEdit, newFacialEdit);

fs.writeFileSync('api/server.js', server);
console.log("Patched server.js with GPU worker integration.");
