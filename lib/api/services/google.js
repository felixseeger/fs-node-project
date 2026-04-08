import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Google Gemini (Imagen 3) Service
 */
export async function generateImage(params) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  }

  const { prompt, aspect_ratio, num_images = 1 } = params;

  // Map aspect ratios to Google format if needed
  // Google typically expects specific strings or numbers
  const aspectMap = {
    '1:1': '1:1',
    '16:9': '16:9',
    '9:16': '9:16',
    '4:3': '4:3',
    '3:4': '3:4',
  };

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Note: Imagen 3 might be accessed via a specific model name
  // Depending on the API version, it might be 'imagen-3.0-generate-002'
  const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-002' });

  console.log(`[Google] Generating image with Imagen 3: ${prompt.substring(0, 50)}...`);

  try {
    // Current Gemini API for Imagen 3 (as of recent updates)
    // Note: The method name might vary if the SDK is very new
    // Some versions use generateImages, others use predict
    
    // We'll use a fetch-based approach if the SDK is uncertain, 
    // but typically the SDK handles it.
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt,
          },
        ],
        parameters: {
          sampleCount: num_images,
          aspectRatio: aspectMap[aspect_ratio] || '1:1',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Google] API Error:', JSON.stringify(data, null, 2));
      const err = new Error(data.error?.message || 'Google Image API failed');
      err.status = response.status;
      err.data = data;
      throw err;
    }

    // Extract images
    if (!data.predictions || !data.predictions.length) {
      throw new Error('No images returned from Google API');
    }

    // Google returns base64 in bytesBase64Encoded
    const generated = data.predictions.map(pred => {
      if (pred.bytesBase64Encoded) {
        return `data:image/png;base64,${pred.bytesBase64Encoded}`;
      }
      return null;
    }).filter(Boolean);

    return {
      data: {
        generated,
        status: 'COMPLETED'
      }
    };
  } catch (error) {
    console.error('[Google] Generation failed:', error);
    throw error;
  }
}
