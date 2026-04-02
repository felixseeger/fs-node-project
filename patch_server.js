const fs = require('fs');
let server = fs.readFileSync('api/server.js', 'utf8');

if (!server.includes('/api/facial-edit')) {
  const newRoute = `
// ── Facial Editing (PixelSmile) Mock Route ──
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
});
`;
  
  // Insert before the server start
  const portRegex = /const PORT = process\.env\.PORT \|\| 3001;/;
  server = server.replace(portRegex, newRoute + "\n" + 'const PORT = process.env.PORT || 3001;');
  fs.writeFileSync('api/server.js', server);
  console.log("Patched api/server.js with /api/facial-edit");
} else {
  console.log("api/server.js already patched");
}
