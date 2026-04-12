import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiDir = path.join(__dirname, '../lib/api');

const freepikServiceFile = path.join(apiDir, 'services/freepik.js');
let freepikCode = fs.readFileSync(freepikServiceFile, 'utf8');

const checkSSRF = `
          const parsedUrl = new URL(imgUrl);
          const hostname = parsedUrl.hostname;
          if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('10.') || hostname.startsWith('192.168.') || hostname.startsWith('169.254.') || hostname.startsWith('172.16.')) {
            throw new Error('Invalid or restricted URL provided');
          }
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s fetch timeout
          const imgRes = await fetch(imgUrl, { signal: controller.signal });
          clearTimeout(timeoutId);
`;

freepikCode = freepikCode.replace(
  / {10}const imgRes = await fetch\(imgUrl\);/,
  checkSSRF
);

fs.writeFileSync(freepikServiceFile, freepikCode);
console.log('Added SSRF protection and timeout to image fetching in freepik.js');
