import * as dotenv from 'dotenv';
dotenv.config({ path: 'api/.env' });
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GEMINI_API_KEY}`)
.then(r => r.json())
.then(d => {
  const imagen = d.models.filter(m => m.name.includes('imagen'));
  console.log(imagen);
})
.catch(console.error);
