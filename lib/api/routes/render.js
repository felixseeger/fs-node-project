import { Router } from 'express';
import { renderMediaOnLambda } from '@remotion/lambda/client';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Ensure these are set in your environment
const REGION = process.env.REMOTION_AWS_REGION || 'us-east-1';
const FUNCTION_NAME = process.env.REMOTION_FUNCTION_NAME || 'remotion-render';
const SERVE_URL = process.env.REMOTION_SERVE_URL || 'https://your-deployed-remotion-site.com';

router.post('/render-video', async (req, res, next) => {
  try {
    const { layers, width = 1920, height = 1080, fps = 30, durationInFrames = 300 } = req.body;

    if (!layers || !Array.isArray(layers)) {
      return res.status(400).json({ error: 'Invalid or missing layers array' });
    }

    console.log(`Starting Lambda render for ${layers.length} layers...`);

    // Render the media on AWS Lambda
    const { renderId, bucketName } = await renderMediaOnLambda({
      region: REGION as any,
      functionName: FUNCTION_NAME,
      serveUrl: SERVE_URL,
      composition: 'MainComposition',
      inputProps: {
        layers,
      },
      codec: 'h264',
      imageFormat: 'jpeg',
      maxRetries: 1,
      privacy: 'public',
    });

    console.log(`Render submitted to Lambda! renderId: ${renderId}`);

    // Return the tracking info so the client can poll the Lambda status
    // Or you can immediately return success and a webhook if configured
    res.json({
      success: true,
      renderId,
      bucketName,
      message: 'Render job submitted to AWS Lambda'
    });

  } catch (error) {
    console.error('Error rendering video via Lambda:', error);
    next(error);
  }
});

export default router;
