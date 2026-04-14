import fs from 'fs';

const file = 'lib/api/routes/aiWorkflow.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/'claude-sonnet-4-6'/g, "'claude-3-5-sonnet-20241022'");
content = content.replace(/'claude-haiku-4-5-20251001'/g, "'claude-3-5-sonnet-20241022'");
content = content.replace(/'claude-3-5-sonnet-20240620'/g, "'claude-3-5-sonnet-20241022'");
content = content.replace(/'claude-sonnet-4-20250514'/g, "'claude-3-5-sonnet-20241022'");

fs.writeFileSync(file, content);
console.log('Patched models in aiWorkflow.js');
