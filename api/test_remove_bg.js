import './env.js';
import { removeBackground } from '../lib/api/services/freepik.js';
import fs from 'fs';

(async () => {
  try {
    const base64Img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    console.log("Testing Freepik background removal using base64 payload...");
    
    // Now that we support data URL -> Blob conversion
    const result = await removeBackground(base64Img);
    
    if (result.data && result.data.url) {
      console.log(`Success! Image available at: ${result.data.url}`);
    } else if (result.data && result.data.base64) {
      console.log(`Success! Received base64 image data of length ${result.data.base64.length}`);
    } else if (result.data) {
      console.log("Success with data object.");
    }
  } catch (error) {
    console.error("Test failed:", error.message);
  }
})();
