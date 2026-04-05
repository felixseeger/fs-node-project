import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

// Read from api/.env
const envStr = fs.readFileSync('.env', 'utf8');
const keyMatch = envStr.match(/ANTHROPIC_API_KEY="([^"]+)"/);
const apiKey = keyMatch ? keyMatch[1] : null;

const anthropic = new Anthropic({
  apiKey
});

async function main() {
  const imgBuffer = fs.readFileSync('./../test.jpg');
  const base64Img = imgBuffer.toString('base64');
  
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Img
            }
          },
          {
            type: 'text',
            text: 'Describe the ENTIRE image in extreme detail. Read all the text on the UI. List every single button, menu, input, or section. Does it mention "Input" or "Output" anywhere?'
          }
        ]
      }
    ]
  });
  
  console.log(msg.content[0].text);
}
main().catch(console.error);
