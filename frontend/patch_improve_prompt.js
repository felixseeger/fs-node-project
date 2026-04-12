import fs from 'fs';
const googleJsPath = '../lib/api/services/google.js';
let googleJs = fs.readFileSync(googleJsPath, 'utf8');

if (!googleJs.includes('improvePrompt')) {
  googleJs += `
export async function improvePrompt(prompt, type = 'general', language = 'en') {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const systemInstruction = \`You are an expert prompt engineer. Your task is to take the user's short or poorly written prompt and expand it into a highly detailed, descriptive, and optimized prompt suitable for state-of-the-art AI image or video generators.
  - The requested style/type is: \${type}.
  - The output language should be: \${language}.
  - Output ONLY the improved prompt text. Do not include any conversational filler like "Here is the prompt:" or "Improved prompt:".\`;

  const result = await model.generateContent([
    systemInstruction,
    prompt
  ]);

  const response = await result.response;
  return response.text().trim();
}
`;
  fs.writeFileSync(googleJsPath, googleJs);
  console.log('Added improvePrompt to google.js');
}

const visionJsPath = '../lib/api/routes/vision.js';
let visionJs = fs.readFileSync(visionJsPath, 'utf8');

visionJs = visionJs.replace(
  /const result = await generateQueue\.add\(\(\) => freepik\.improvePrompt\(prompt, type, language\)\);([\s\S]*?)catch \(err\)/,
  `const improved_prompt = await google.improvePrompt(prompt, type, language);
    res.json({
      data: {
        generated: [improved_prompt],
        status: 'COMPLETED'
      }
    });
  } catch (err)`
);

fs.writeFileSync(visionJsPath, visionJs);
console.log('Updated vision.js to use google.improvePrompt');
