import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

async function main() {
  const imgBuffer = fs.readFileSync('frontend/ref/workflow-template-card_library.jpg');
  const base64Img = imgBuffer.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: base64Img,
              mimeType: 'image/jpeg'
            }
          },
          {
            text: 'Analyze this UI component carefully. This is a workflow template card in a library. Describe its layout, styling, colors, typography, buttons, tags, icons, hover states if obvious, and any metadata (e.g. author, run count, price/credits). Please list the exact CSS-like properties or visual characteristics needed to replicate it precisely. If there is an image, describe it. Tell me the exact layout structure.'
          }
        ]
      }
    ]
  });
  
  console.log(response.text);
}
main().catch(console.error);
