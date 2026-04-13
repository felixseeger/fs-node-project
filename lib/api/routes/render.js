import { Router } from 'express';
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia } from '@remotion/renderer';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/render-video', async (req, res, next) => {
  try {
    const { layers, width = 1920, height = 1080, fps = 30, durationInFrames = 300 } = req.body;

    if (!layers || !Array.isArray(layers)) {
      return res.status(400).json({ error: 'Invalid or missing layers array' });
    }

    // Path to the Remotion entry point in the frontend
    const entryPoint = path.resolve(process.cwd(), '../frontend/src/remotion/index.ts');
    
    console.log(`Bundling Remotion project at ${entryPoint}...`);
    
    // Bundle the project
    const serveUrl = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    });

    console.log(`Selecting composition...`);
    
    // Select the composition
    const composition = await selectComposition({
      serveUrl,
      id: 'MainComposition',
      inputProps: {
        layers,
      },
    });

    const outputId = uuidv4();
    const outputLocation = path.join(os.tmpdir(), `render-${outputId}.mp4`);

    console.log(`Rendering media to ${outputLocation}...`);

    // Render the media
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation,
      inputProps: {
        layers,
      },
      onProgress: ({ progress }) => {
        console.log(`Rendering progress: ${Math.round(progress * 100)}%`);
      },
    });

    console.log(`Render complete!`);

    // Read the file into a buffer
    const videoBuffer = fs.readFileSync(outputLocation);

    // Clean up the temporary file
    fs.unlinkSync(outputLocation);

    // Send the buffer as the response
    res.set('Content-Type', 'video/mp4');
    res.set('Content-Disposition', `attachment; filename="render-${outputId}.mp4"`);
    res.send(videoBuffer);

  } catch (error) {
    console.error('Error rendering video:', error);
    next(error);
  }
});

export default router;
