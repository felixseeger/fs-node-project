import fs from 'fs';
let content = fs.readFileSync('lib/api/services/freepik.js', 'utf-8');

content = content.replace(
  "'x-freepik-api-key': FREEPIK_API_KEY,",
  "'x-freepik-api-key': process.env.FREEPIK_API_KEY,"
);

fs.writeFileSync('lib/api/services/freepik.js', content);
console.log("Patched background removal bug");
