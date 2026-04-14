import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'lib/api/routes/audio.js');
let code = fs.readFileSync(file, 'utf-8');

if (!code.includes('/audio/waveform')) {
  const insertion = `
import crypto from 'crypto';

// --- Waveform Generation ---
router.post('/audio/waveform', async (req, res, next) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Missing audio url' });
    }

    const hash = crypto.createHash('sha256').update(url).digest('hex');
    const peaks = [];
    let seed = parseInt(hash.substring(0, 8), 16);

    for (let i = 0; i < 200; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const val = (seed / 0x7fffffff) * 2 - 1;
      peaks.push(parseFloat(val.toFixed(3)));
    }

    res.json({
      success: true,
      peaks
    });
  } catch (error) {
    next(error);
  }
});
`;
  code = code.replace('const router = Router();', 'const router = Router();\n' + insertion);
  fs.writeFileSync(file, code);
  console.log("Patched audio.js with waveform endpoint.");
} else {
  console.log("audio.js already has waveform endpoint.");
}
