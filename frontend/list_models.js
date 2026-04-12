import dotenv from 'dotenv';
dotenv.config({ path: '../api/.env' });
import { GoogleGenerativeAI } from '@google/generative-ai';

async function list() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  // Wait, I can just use a fetch
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GEMINI_API_KEY}`);
  const data = await res.json();
  data.models.forEach(m => console.log(m.name));
}
list().catch(console.error);
