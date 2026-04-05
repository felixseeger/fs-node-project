import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function main() {
  const imgBuffer = fs.readFileSync('../test.jpg');
  const base64Img = imgBuffer.toString('base64');
  
  const msg = await anthropic.messages.create({
    model: 'claude-3-7-sonnet-20250219',
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
