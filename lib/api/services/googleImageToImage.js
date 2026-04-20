import * as google from './google.js';

/**
 * Google Image-to-Image Service
 * Workaround for Imagen's lack of native image conditioning:
 * 1. Analyze reference image with Gemini vision
 * 2. Extract style/composition elements
 * 3. Merge with user prompt
 * 4. Generate with Imagen
 */

export async function generateImage(params) {
  const { prompt, image, aspect_ratio = '1:1', n = 1 } = params;

  if (!image) {
    // No reference image → fall back to standard generation
    return google.generateImage({ prompt, aspect_ratio, num_images: n });
  }

  console.log('[GoogleImageToImage] Analyzing reference image for style transfer...');

  try {
    // Step 1: Analyze reference image
    const styleAnalysis = await google.analyzeImage({
      images: [image],
      prompt: `Analyze this image's visual style, composition, and key characteristics. Extract: 1) Subject/main elements, 2) Lighting style, 3) Color palette, 4) Texture/material qualities, 5) Camera angle/perspective, 6) Mood/atmosphere. Be concise. Output as a structured analysis.`,
      systemDirections: 'You are a visual style analyzer. Extract key visual characteristics that could inform image generation.'
    });

    // Step 2: Merge style with user prompt
    const enhancedPrompt = `Base prompt: "${prompt}"\n\nVisual reference style (apply these characteristics): ${styleAnalysis}`;

    console.log('[GoogleImageToImage] Enhanced prompt with style analysis');

    // Step 3: Generate with Imagen using enhanced prompt
    return google.generateImage({
      prompt: enhancedPrompt,
      aspect_ratio,
      num_images: n
    });
  } catch (error) {
    console.error('[GoogleImageToImage] Generation failed:', error);
    throw error;
  }
}
