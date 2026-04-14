import fs from 'fs';
let content = fs.readFileSync('lib/api/routes/recraft.js', 'utf-8');

const oldCode = `router.post('/recraft/remove-background', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Recraft Remove Background');
    const { image_url } = req.body;
    if (!image_url) throw new Error('image_url is required');
    
    const buffer = await getBufferFromUrl(image_url);
    const filename = getFilenameFromUrl(image_url);
    
    const result = await generateQueue.add(() => recraft.removeBackground(buffer, filename));
    res.json(result);
  } catch (err) {
    console.error('[API] Recraft Remove Background failed:', err.message);
    next(err);
  }
});`;

const newCode = `router.post('/recraft/remove-background', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Recraft Remove Background');
    const { image_url } = req.body;
    if (!image_url) throw new Error('image_url is required');
    
    let buffer;
    let filename;
    
    if (image_url.startsWith('data:image')) {
      const base64Data = image_url.split(',')[1];
      buffer = Buffer.from(base64Data, 'base64');
      const mimeMatch = image_url.match(/data:(.*?);/);
      const extension = mimeMatch ? mimeMatch[1].split('/')[1] : 'jpg';
      filename = \`image.\${extension}\`;
    } else {
      buffer = await getBufferFromUrl(image_url);
      filename = getFilenameFromUrl(image_url);
    }
    
    const result = await generateQueue.add(() => recraft.removeBackground(buffer, filename));
    res.json(result);
  } catch (err) {
    console.error('[API] Recraft Remove Background failed:', err.message);
    next(err);
  }
});`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('lib/api/routes/recraft.js', content);
console.log("Patched Recraft remove background to support base64");
