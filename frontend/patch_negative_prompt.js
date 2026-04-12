import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiDir = path.join(__dirname, '../lib/api');

const freepikServiceFile = path.join(apiDir, 'services/freepik.js');
let freepikCode = fs.readFileSync(freepikServiceFile, 'utf8');

const replaceStr = `  const body = {
    prompt: prompt || 'a beautiful image',
    aspect_ratio: aspectMap[aspect_ratio] || aspect_ratio || 'square_1_1',
  };
  if (params.negative_prompt) {
    body.negative_prompt = params.negative_prompt;
  }
`;

freepikCode = freepikCode.replace(
  / {2}const body = \{\n {4}prompt: prompt \|\| 'a beautiful image',\n {4}aspect_ratio: aspectMap\[aspect_ratio\] \|\| aspect_ratio \|\| 'square_1_1',\n {2}\};\n/,
  replaceStr
);

fs.writeFileSync(freepikServiceFile, freepikCode);
console.log('Added negative_prompt mapping to generateImage in freepik.js');

