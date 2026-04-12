import { parseSync } from 'oxc-parser';
import fs from 'fs';

const sourceText = fs.readFileSync('src/App.tsx', 'utf8');
try {
  const result = parseSync('src/App.tsx', sourceText);
  console.log('Parse successful! Errors:', result.errors);
} catch (e) {
  console.error('Parse failed!', e);
}
