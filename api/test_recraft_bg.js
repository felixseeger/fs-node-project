import './env.js';
import recraftRouter from '../lib/api/routes/recraft.js';
// Actually, it's easier to just call the function directly since we bypassed the route logic 
// in the test. Let's just create a small Express mock to test the route:
import express from 'express';
import request from 'supertest';
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(recraftRouter);

(async () => {
  const base64Img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  try {
    console.log("Testing Recraft background removal with base64 payload...");
    const res = await request(app)
      .post('/recraft/remove-background')
      .send({ image_url: base64Img });
      
    console.log("Status:", res.status);
    if (res.body) console.log("Response:", Object.keys(res.body));
  } catch (e) {
    console.error(e);
  }
})();
