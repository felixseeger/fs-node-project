/* eslint-disable no-useless-escape */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiDir = path.join(__dirname, '../lib/api');

const freepikServiceFile = path.join(apiDir, 'services/freepik.js');
let freepikCode = fs.readFileSync(freepikServiceFile, 'utf8');

const strictAuth = `  const apiKey = process.env.FREEPIK_API_KEY;
  if (!apiKey) {
    throw new Error('Freepik API key is not configured');
  }`;

freepikCode = freepikCode.replace(
  / {2}const apiKey = process\.env\.FREEPIK_API_KEY;\n {2}if \(\!apiKey\) \{\n {4}console\.error\('\[Freepik\] Warning: FREEPIK_API_KEY is not set'\);\n {2}\}/,
  strictAuth
);

fs.writeFileSync(freepikServiceFile, freepikCode);
console.log('Enforced strict API key checking in freepik.js');
