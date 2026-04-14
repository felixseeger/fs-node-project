import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Google Gemini (Imagen 4) Service
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

  // Use Imagen 3.0 or 3.1 (current stable version as of 2026)
  // If Imagen 4 becomes available, update this constant
  const IMAGEN_MODEL = process.env.GOOGLE_IMAGEN_MODEL || 'imagen-3.0-generate-001';

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: IMAGEN_MODEL });

  console.log(`[Google] Generating image with Imagen: ${prompt.substring(0, 50)}...`);

  try {
    // Current Gemini API for Imagen
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${apiKey}`, {
      signal: controller.signal,
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

    clearTimeout(timeoutId);
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

export async function imageToPrompt(base64Image) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  let mimeType = 'image/jpeg';
  let data = base64Image;

  if (base64Image.startsWith('data:image')) {
    const parts = base64Image.split(';');
    mimeType = parts[0].split(':')[1];
    data = parts[1].split(',')[1];
  }

  const result = await model.generateContent([
    "Describe this image in detail, focusing on the visual elements, style, lighting, and composition. Your description will be used as a prompt to generate a similar image, so be concise but descriptive. Output ONLY the prompt text without any conversational filler.",
    {
      inlineData: {
        data,
        mimeType
      }
    }
  ]);

  const response = await result.response;
  return response.text();
}

export async function improvePrompt(prompt, type = 'general', language = 'en') {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const systemInstruction = `You are an expert prompt engineer. Your task is to take the user's short or poorly written prompt and expand it into a highly detailed, descriptive, and optimized prompt suitable for state-of-the-art AI image or video generators.
  - The requested style/type is: ${type}.
  - The output language should be: ${language}.
  - CRITICAL: Apply the "JSON Control Hack" optimized for Nano Banana 2 Pro. Move away from descriptive prose towards property-based prompting. Output your prompt strictly as a structured JSON string containing keys like "subject", "composition", "lighting", "color_palette", "camera_angle", and "mood".
  - This JSON structure ensures maximum spatial consistency, adherence, and artifact reduction when passed to the rendering engine.
  - Output ONLY the raw JSON string. Do NOT wrap it in markdown code blocks (\`\`\`json). No conversational filler.`;

  const result = await model.generateContent([
    systemInstruction,
    prompt
  ]);

  const response = await result.response;
  return response.text().trim();
}

export async function analyzeImage({ images, prompt, systemDirections }) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use Gemini 3.0 Pro for the vision analysis tasks
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    systemInstruction: systemDirections || 'You are an expert image analyst. Provide detailed, useful analysis.'
  });

  const contentParts = [];
  
  // Format images for Gemini
  for (const img of images) {
    if (typeof img !== "string") continue;
    if (img.startsWith("data:image")) {
      const parts = img.split(";");
      const mimeType = parts[0].split(":")[1];
      const data = parts[1].split(",")[1];
      contentParts.push({ inlineData: { data, mimeType } });
    } else if (img.startsWith("http")) {
      try {
        const res = await fetch(img);
        const buffer = await res.arrayBuffer();
        const data = Buffer.from(buffer).toString("base64");
        const mimeType = res.headers.get("content-type") || "image/jpeg";
        contentParts.push({ inlineData: { data, mimeType } });
      } catch (err) {
        console.warn("[Google] Failed to fetch URL image:", err.message);
      }
    }
  }
  contentParts.push(prompt || 'Analyze this image in detail.');

  const result = await model.generateContent(contentParts);
  const response = await result.response;
  return response.text();
}

/**
 * Generic text completion with Google Gemini
 */
export async function generateText({ prompt, system, history = [], images = [], maxTokens = 2048 }) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    systemInstruction: system || 'You are a helpful assistant.'
  });

  // Map history to Google format
  const chatHistory = history.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: maxTokens,
    },
  });

  const contentParts = [];
  
  // Format images for Gemini
  for (const img of images) {
    if (typeof img !== "string") continue;
    if (img.startsWith("data:image")) {
      const parts = img.split(";");
      const mimeType = parts[0].split(":")[1];
      const data = parts[1].split(",")[1];
      contentParts.push({ inlineData: { data, mimeType } });
    }
  }
  
  contentParts.push({ text: prompt });

  const result = await chat.sendMessage(contentParts);
  const response = await result.response;
  return response.text();
}

/**
 * Transcribe audio using Google Gemini
 */
export async function transcribeAudio({ audio, mimeType = 'audio/mpeg', prompt = 'Transcribe this audio accurately. Output ONLY the transcription text.' }) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Use Gemini 1.5 Flash for fast transcription
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  let data;
  let resolvedMimeType = mimeType;

  if (typeof audio === 'string' && audio.startsWith('data:audio')) {
    const parts = audio.split(';');
    resolvedMimeType = parts[0].split(':')[1];
    data = parts[1].split(',')[1];
  } else if (Buffer.isBuffer(audio)) {
    data = audio.toString('base64');
  } else {
    data = audio; // Assume it's already base64
  }

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data,
        mimeType: resolvedMimeType
      }
    }
  ]);

  const response = await result.response;
  return response.text().trim();
}
