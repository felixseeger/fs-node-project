import fs from 'fs';

async function main() {
  try {
    const res = await fetch('http://localhost:3001/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `{"subject": "A brilliant, glowing constellation of stars forming a majestic, futuristic AI assistant named Gemini. Cosmic intelligence, neon blue and deep purple, ultra-detailed, cinematic lighting, 8k resolution, photorealistic digital art.", "composition": "Centered, grand scale", "lighting": "Cinematic, glowing, neon", "color_palette": "Neon blue, deep purple, starlight white", "camera_angle": "Eye-level"}`,
        model: 'Nano Banana 2',
        num_images: 1,
        aspect_ratio: '1:1'
      })
    });
    const data = await res.json();
    if (data.data && data.data.generated && data.data.generated.length > 0) {
      const b64 = data.data.generated[0].replace(/^data:image\/.*?;base64,/, '');
      fs.writeFileSync('gemini_avatar_improved.png', b64, 'base64');
      console.log('SUCCESS: gemini_avatar_improved.png');
    } else {
      console.error('FAILED:', data);
    }
  } catch (err) {
    console.error('ERROR:', err);
  }
}
main();
