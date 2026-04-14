import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/render-video', async (req, res, next) => {
  try {
    const { layers, width = 1920, height = 1080, fps = 30, durationInFrames = 300 } = req.body;

    if (!layers || !Array.isArray(layers)) {
      return res.status(400).json({ error: 'Invalid or missing layers array' });
    }

    console.log(`Starting dummy render for ${layers.length} layers...`);

    res.json({
      success: true,
      renderId: uuidv4(),
      bucketName: 'mock-bucket',
      message: 'Render job submitted (Mock)'
    });

  } catch (error) {
    console.error('Error rendering video:', error);
    next(error);
  }
});

export default router;
