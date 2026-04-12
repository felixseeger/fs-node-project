import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiDir = path.join(__dirname, '../lib/api');

const imagesRouteFile = path.join(apiDir, 'routes/images.js');
let imagesRouteCode = fs.readFileSync(imagesRouteFile, 'utf8');

if (!imagesRouteCode.includes('/generate-kora')) {
  const koraRoute = `
/**
 * POST /api/generate-kora
 */
router.post('/generate-kora', generationLimiter, validate([validators.prompt, validators.negativePrompt, validators.aspectRatio, validators.numImages]), async (req, res, next) => {
  try {
    const { prompt } = req.body;
    console.log(\`[API] Generating Kora image, prompt: \${prompt?.substring(0, 50)}...\`);
    
    const result = await generateQueue.add(() => freepik.generateKora(req.body));
    
    res.json(result);
  } catch (err) {
    next(err);
  }
});
`;

  imagesRouteCode = imagesRouteCode.replace(
    /\/\*\* \n \* GET \/api\/status\/:taskId/,
    koraRoute + '\n/** \n * GET /api/status/:taskId'
  );
  fs.writeFileSync(imagesRouteFile, imagesRouteCode);
  console.log('Added /generate-kora route to images.js');
}

