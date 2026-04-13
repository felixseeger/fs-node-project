import dotenv from 'dotenv';
dotenv.config();

import { generateImage } from '../lib/api/services/google.js';
import { generateLtxVideo } from '../lib/api/services/ltxService.js';

async function run() {
  try {
    console.log("Testing Google Image Generation...");
    const res = await generateImage({
      prompt: "A cute robot",
      aspect_ratio: "1:1",
      model: "Nano Banana 2",
      num_images: 1
    });
    console.log("Image generation result:", res);

    console.log("\nTesting LTX Video Generation...");
    // Let's check generateLtxVideo arguments: prompt, webhookUrl, options
    const vidRes = await generateLtxVideo("A cute robot", "http://localhost:3001/api/webhooks/vfx", { width: 768, height: 512, frames: 121 });
    console.log("Video generation result:", vidRes);

  } catch (e) {
    console.error("Error:", e.message || e);
  }
}
run();
