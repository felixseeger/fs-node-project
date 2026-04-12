import dotenv from 'dotenv';
dotenv.config({ path: '../api/.env' });
import { improvePrompt } from '../lib/api/services/google.js';

async function test() {
  const result = await improvePrompt("A cat on a skateboard", "cinematic", "en");
  console.log("Improved:", result);
}
test().catch(console.error);
