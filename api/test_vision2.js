import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function main() {
  const images = ['main_menu.jpg', 'image-node_menu.png', 'topbar.png', 'navbar_nodes.jpg'].filter(f => fs.existsSync('../frontend/ref/' + f));
  
  if (images.length === 0) return console.log('no images found');
  
  for (const imgName of images) {
    const imgBuffer = fs.readFileSync('../frontend/ref/' + imgName);
    const base64Img = imgBuffer.toString('base64');
    
    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/' + (imgName.endsWith('.png') ? 'png' : 'jpeg'), data: base64Img }
            },
            {
              type: 'text',
              text: 'Does this image mention "Layer Input" or "Layer Output" or show options for them? Give a short summary of the text in the image.'
            }
          ]
        }
      ]
    });
    console.log(`\n--- ${imgName} ---`);
    console.log(msg.content[0].text);
  }
}
main().catch(console.error);
