import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const FREEPIK_API = 'https://api.freepik.com/v1/ai/mystic';
const freepikHeaders = {
  'Content-Type': 'application/json',
  'x-freepik-api-key': process.env.FREEPIK_API_KEY,
};

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// --- Nano Banana 2 Edit (Mystic API) ---
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, image_urls, aspect_ratio, resolution, num_images } = req.body;

    const resolutionMap = { '1K': '1k', '2K': '2k', '4K': '4k' };
    const aspectMap = {
      '1:1': 'square_1_1',
      '16:9': 'widescreen_16_9',
      '9:16': 'social_story_9_16',
      '4:3': 'standard_4_3',
      '3:4': 'portrait_3_4',
      '3:2': 'classic_3_2',
      '2:3': 'classic_2_3',
    };

    const body = {
      prompt: prompt || 'a beautiful image',
      resolution: resolutionMap[resolution] || '2k',
      aspect_ratio: aspectMap[aspect_ratio] || 'square_1_1',
      num_images: num_images || 1,
    };

    // If images provided, use first as structure reference (base64)
    if (image_urls && image_urls.length > 0) {
      const imgUrl = image_urls[0];
      if (imgUrl.startsWith('data:')) {
        const base64 = imgUrl.split(',')[1];
        body.structure_reference = base64;
        body.structure_strength = 60;
      } else {
        // Fetch the image and convert to base64
        const imgRes = await fetch(imgUrl);
        const buf = Buffer.from(await imgRes.arrayBuffer());
        body.structure_reference = buf.toString('base64');
        body.structure_strength = 60;
      }
    }

    const response = await fetch(FREEPIK_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('generate-image error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Kora Reality (Mystic API with realism model, no image input) ---
app.post('/api/generate-kora', async (req, res) => {
  try {
    const { prompt, aspect_ratio, resolution, num_images } = req.body;

    const resolutionMap = { 'HD': '1k', '2K': '2k' };
    const aspectMap = {
      '1:1': 'square_1_1',
      '16:9': 'widescreen_16_9',
      '9:16': 'social_story_9_16',
      '4:3': 'standard_4_3',
      '3:4': 'portrait_3_4',
      '3:2': 'classic_3_2',
      '2:3': 'classic_2_3',
    };

    const body = {
      prompt: prompt || 'a beautiful image',
      resolution: resolutionMap[resolution] || '2k',
      aspect_ratio: aspectMap[aspect_ratio] || 'square_1_1',
      model: 'realism',
      num_images: num_images || 1,
    };

    const response = await fetch(FREEPIK_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('generate-kora error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Poll task status ---
app.get('/api/status/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${FREEPIK_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Claude Sonnet Vision - Image Analyzer ---
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { images, prompt, systemDirections } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    const content = [];

    for (const img of images) {
      if (img.startsWith('data:')) {
        const [header, base64] = img.split(',');
        const mediaType = header.match(/data:(.*);/)[1];
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        });
      } else {
        content.push({
          type: 'image',
          source: { type: 'url', url: img },
        });
      }
    }

    if (prompt) {
      content.push({ type: 'text', text: prompt });
    } else {
      content.push({ type: 'text', text: 'Analyze this image in detail.' });
    }

    const messages = [{ role: 'user', content }];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemDirections || 'You are an expert image analyst. Provide detailed, useful analysis.',
      messages,
    });

    const analysisText = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n');

    res.json({ analysis: analysisText });
  } catch (err) {
    console.error('analyze-image error:', err);
    const apiMsg = err?.error?.error?.message || err?.message || 'Unknown error';
    res.status(err?.status || 500).json({ error: apiMsg });
  }
});

// --- Creative Upscale (Magnific) ---
const UPSCALE_API = 'https://api.freepik.com/v1/ai/image-upscaler';
const PRECISION_API = 'https://api.freepik.com/v1/ai/image-upscaler-precision-v2';

app.post('/api/upscale-creative', async (req, res) => {
  try {
    const {
      image,
      scale_factor,
      optimized_for,
      prompt,
      creativity,
      hdr,
      resemblance,
      fractality,
      engine,
      filter_nsfw,
    } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const body = { image };
    if (scale_factor) body.scale_factor = scale_factor;
    if (optimized_for) body.optimized_for = optimized_for;
    if (prompt) body.prompt = prompt;
    if (creativity !== undefined) body.creativity = creativity;
    if (hdr !== undefined) body.hdr = hdr;
    if (resemblance !== undefined) body.resemblance = resemblance;
    if (fractality !== undefined) body.fractality = fractality;
    if (engine) body.engine = engine;
    if (filter_nsfw !== undefined) body.filter_nsfw = filter_nsfw;

    const response = await fetch(UPSCALE_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('upscale-creative error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/upscale-creative/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${UPSCALE_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('upscale-creative status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Precision Upscale V2 ---
app.post('/api/upscale-precision', async (req, res) => {
  try {
    const {
      image,
      scale_factor,
      sharpen,
      smart_grain,
      ultra_detail,
      flavor,
    } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const body = { image };
    if (scale_factor !== undefined) body.scale_factor = scale_factor;
    if (sharpen !== undefined) body.sharpen = sharpen;
    if (smart_grain !== undefined) body.smart_grain = smart_grain;
    if (ultra_detail !== undefined) body.ultra_detail = ultra_detail;
    if (flavor) body.flavor = flavor;

    const response = await fetch(PRECISION_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('upscale-precision error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/upscale-precision/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${PRECISION_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('upscale-precision status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Image Relight ---
const RELIGHT_API = 'https://api.freepik.com/v1/ai/image-relight';

app.post('/api/relight', async (req, res) => {
  try {
    const {
      image,
      prompt,
      transfer_light_from_reference_image,
      transfer_light_from_lightmap,
      light_transfer_strength,
      interpolate_from_original,
      change_background,
      style,
      preserve_details,
      advanced_settings,
    } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const body = { image };
    if (prompt) body.prompt = prompt;
    if (transfer_light_from_reference_image) body.transfer_light_from_reference_image = transfer_light_from_reference_image;
    if (transfer_light_from_lightmap) body.transfer_light_from_lightmap = transfer_light_from_lightmap;
    if (light_transfer_strength !== undefined) body.light_transfer_strength = light_transfer_strength;
    if (interpolate_from_original !== undefined) body.interpolate_from_original = interpolate_from_original;
    if (change_background !== undefined) body.change_background = change_background;
    if (style) body.style = style;
    if (preserve_details !== undefined) body.preserve_details = preserve_details;
    if (advanced_settings) body.advanced_settings = advanced_settings;

    const response = await fetch(RELIGHT_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('relight error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/relight/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${RELIGHT_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('relight status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Style Transfer ---
const STYLE_TRANSFER_API = 'https://api.freepik.com/v1/ai/image-style-transfer';

app.post('/api/style-transfer', async (req, res) => {
  try {
    const {
      image,
      reference_image,
      prompt,
      style_strength,
      structure_strength,
      is_portrait,
      portrait_style,
      portrait_beautifier,
      flavor,
      engine,
      fixed_generation,
    } = req.body;

    if (!image) return res.status(400).json({ error: 'Image is required' });
    if (!reference_image) return res.status(400).json({ error: 'Reference image is required' });

    const body = { image, reference_image };
    if (prompt) body.prompt = prompt;
    if (style_strength !== undefined) body.style_strength = style_strength;
    if (structure_strength !== undefined) body.structure_strength = structure_strength;
    if (is_portrait !== undefined) body.is_portrait = is_portrait;
    if (portrait_style) body.portrait_style = portrait_style;
    if (portrait_beautifier) body.portrait_beautifier = portrait_beautifier;
    if (flavor) body.flavor = flavor;
    if (engine) body.engine = engine;
    if (fixed_generation !== undefined) body.fixed_generation = fixed_generation;

    const response = await fetch(STYLE_TRANSFER_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('style-transfer error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/style-transfer/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${STYLE_TRANSFER_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('style-transfer status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Remove Background (Synchronous) ---
app.post('/api/remove-background', async (req, res) => {
  try {
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const formData = new URLSearchParams();
    formData.append('image_url', image_url);

    const response = await fetch('https://api.freepik.com/v1/ai/beta/remove-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-freepik-api-key': process.env.FREEPIK_API_KEY,
      },
      body: formData.toString(),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('remove-background error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Flux Reimagine (Synchronous) ---
app.post('/api/reimagine-flux', async (req, res) => {
  try {
    const { image, prompt, imagination, aspect_ratio } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const body = { image };
    if (prompt) body.prompt = prompt;
    if (imagination) body.imagination = imagination;
    if (aspect_ratio) body.aspect_ratio = aspect_ratio;

    const response = await fetch('https://api.freepik.com/v1/ai/beta/text-to-image/reimagine-flux', {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('reimagine-flux error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Flux Pro Image Expand (Async) ---
const IMAGE_EXPAND_API = 'https://api.freepik.com/v1/ai/image-expand/flux-pro';

app.post('/api/image-expand', async (req, res) => {
  try {
    const { image, prompt, left, right, top, bottom } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const body = { image };
    if (prompt) body.prompt = prompt;
    if (left !== undefined) body.left = left;
    if (right !== undefined) body.right = right;
    if (top !== undefined) body.top = top;
    if (bottom !== undefined) body.bottom = bottom;

    const response = await fetch(IMAGE_EXPAND_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('image-expand error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/image-expand/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${IMAGE_EXPAND_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('image-expand status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Seedream V4.5 Image Expand (Async) ---
const SEEDREAM_EXPAND_API = 'https://api.freepik.com/v1/ai/image-expand/seedream-v4-5';

app.post('/api/seedream-expand', async (req, res) => {
  try {
    const { image, left, right, top, bottom, prompt, seed } = req.body;

    if (!image) return res.status(400).json({ error: 'Image is required' });

    const body = {
      image,
      left: left ?? 0,
      right: right ?? 0,
      top: top ?? 0,
      bottom: bottom ?? 0,
    };
    if (prompt) body.prompt = prompt;
    if (seed !== undefined) body.seed = seed;

    const response = await fetch(SEEDREAM_EXPAND_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('seedream-expand error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/seedream-expand/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${SEEDREAM_EXPAND_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('seedream-expand status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Ideogram Image Expand (Async) ---
const IDEOGRAM_EXPAND_API = 'https://api.freepik.com/v1/ai/image-expand/ideogram';

app.post('/api/ideogram-expand', async (req, res) => {
  try {
    const { image, left, right, top, bottom, prompt, seed } = req.body;

    if (!image) return res.status(400).json({ error: 'Image is required' });

    const body = {
      image,
      left: left ?? 0,
      right: right ?? 0,
      top: top ?? 0,
      bottom: bottom ?? 0,
    };
    if (prompt) body.prompt = prompt;
    if (seed !== undefined) body.seed = seed;

    const response = await fetch(IDEOGRAM_EXPAND_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('ideogram-expand error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ideogram-expand/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${IDEOGRAM_EXPAND_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('ideogram-expand status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Skin Enhancer (Async, 3 modes) ---
const SKIN_ENHANCER_BASE = 'https://api.freepik.com/v1/ai/skin-enhancer';

app.post('/api/skin-enhancer/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    const validModes = ['creative', 'faithful', 'flexible'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({ error: `Invalid mode. Use: ${validModes.join(', ')}` });
    }

    const { image, sharpen, smart_grain, skin_detail, optimized_for } = req.body;
    if (!image) return res.status(400).json({ error: 'Image is required' });

    const body = { image };
    if (sharpen !== undefined) body.sharpen = sharpen;
    if (smart_grain !== undefined) body.smart_grain = smart_grain;
    if (mode === 'faithful' && skin_detail !== undefined) body.skin_detail = skin_detail;
    if (mode === 'flexible' && optimized_for) body.optimized_for = optimized_for;

    const response = await fetch(`${SKIN_ENHANCER_BASE}/${mode}`, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('skin-enhancer error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/skin-enhancer/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${SKIN_ENHANCER_BASE}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('skin-enhancer status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Ideogram Inpainting (Async) ---
const IDEOGRAM_EDIT_API = 'https://api.freepik.com/v1/ai/ideogram-image-edit';

app.post('/api/ideogram-inpaint', async (req, res) => {
  try {
    const {
      image, mask, prompt, seed, rendering_speed, magic_prompt,
      color_palette, style_codes, style_type,
      style_reference_images, character_reference_images,
    } = req.body;

    if (!image) return res.status(400).json({ error: 'Image is required' });
    if (!mask) return res.status(400).json({ error: 'Mask is required' });
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const body = { image, mask, prompt };
    if (seed !== undefined) body.seed = seed;
    if (rendering_speed) body.rendering_speed = rendering_speed;
    if (magic_prompt) body.magic_prompt = magic_prompt;
    if (color_palette) body.color_palette = color_palette;
    if (style_codes?.length) body.style_codes = style_codes;
    if (style_type) body.style_type = style_type;
    if (style_reference_images?.length) body.style_reference_images = style_reference_images;
    if (character_reference_images?.length) body.character_reference_images = character_reference_images;

    const response = await fetch(IDEOGRAM_EDIT_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('ideogram-inpaint error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ideogram-inpaint/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${IDEOGRAM_EDIT_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('ideogram-inpaint status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Change Camera (Async) ---
const CHANGE_CAMERA_API = 'https://api.freepik.com/v1/ai/image-change-camera';

app.post('/api/change-camera', async (req, res) => {
  try {
    const { image, horizontal_angle, vertical_angle, zoom, output_format, seed, webhook_url } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const body = { image };
    if (horizontal_angle !== undefined) body.horizontal_angle = horizontal_angle;
    if (vertical_angle !== undefined) body.vertical_angle = vertical_angle;
    if (zoom !== undefined) body.zoom = zoom;
    if (output_format) body.output_format = output_format;
    if (seed !== undefined) body.seed = seed;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(CHANGE_CAMERA_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('change-camera error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/change-camera/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${CHANGE_CAMERA_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('change-camera status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Kling Elements Pro (Async) ---
const KLING_ELEMENTS_PRO_API = 'https://api.freepik.com/v1/ai/image-to-video/kling-elements-pro';

app.post('/api/kling-elements-pro', async (req, res) => {
  try {
    const { images, prompt, negative_prompt, duration, aspect_ratio, webhook_url } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'Images array is required' });
    }

    const body = { images };
    if (prompt) body.prompt = prompt;
    if (negative_prompt) body.negative_prompt = negative_prompt;
    if (duration !== undefined) body.duration = duration.toString();
    if (aspect_ratio) body.aspect_ratio = aspect_ratio;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(KLING_ELEMENTS_PRO_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('kling-elements-pro error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/kling-elements-pro/:taskId', async (req, res) => {
  try {
    // Note: The polling endpoint is /kling-elements/ without -pro, as per docs.
    const response = await fetch(`https://api.freepik.com/v1/ai/image-to-video/kling-elements/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('kling-elements-pro status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Kling 3 Video Generation (Async) ---
const KLING3_BASE_API = 'https://api.freepik.com/v1/ai/video/kling-v3';

app.post('/api/kling3/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    if (mode !== 'pro' && mode !== 'std') {
      return res.status(400).json({ error: 'Invalid mode. Must be "pro" or "std"' });
    }

    const {
      prompt, negative_prompt, start_image_url, end_image_url, multi_shot, shot_type,
      multi_prompt, elements, generate_audio, aspect_ratio, duration, cfg_scale, webhook_url
    } = req.body;

    const body = {};
    if (prompt) body.prompt = prompt;
    if (negative_prompt) body.negative_prompt = negative_prompt;
    if (start_image_url) body.start_image_url = start_image_url;
    if (end_image_url) body.end_image_url = end_image_url;
    if (multi_shot !== undefined) body.multi_shot = multi_shot;
    if (shot_type) body.shot_type = shot_type;
    if (multi_prompt && multi_prompt.length > 0) body.multi_prompt = multi_prompt;
    if (elements && elements.length > 0) body.elements = elements;
    if (generate_audio !== undefined) body.generate_audio = generate_audio;
    if (aspect_ratio) body.aspect_ratio = aspect_ratio;
    if (duration !== undefined) body.duration = duration.toString(); // API wants a string
    if (cfg_scale !== undefined) body.cfg_scale = cfg_scale;
    if (webhook_url) body.webhook_url = webhook_url;

    // Kling 3 endpoint structure uses the suffix for generation
    const endpoint = `${KLING3_BASE_API}-${mode}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('kling3 error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/kling3/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${KLING3_BASE_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('kling3 status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Kling 3 Omni Video Generation (Async) ---
const KLING3_OMNI_BASE_API = 'https://api.freepik.com/v1/ai/video/kling-v3-omni';

app.post('/api/kling3-omni/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    if (mode !== 'pro' && mode !== 'std') {
      return res.status(400).json({ error: 'Invalid mode. Must be "pro" or "std"' });
    }

    const {
      prompt, negative_prompt, start_image_url, end_image_url, image_urls, elements,
      multi_shot, shot_type, multi_prompt, generate_audio, voice_ids,
      aspect_ratio, duration, cfg_scale, webhook_url, video_url
    } = req.body;

    const body = {};
    if (prompt) body.prompt = prompt;
    if (negative_prompt) body.negative_prompt = negative_prompt;
    if (start_image_url) body.start_image_url = start_image_url;
    if (end_image_url) body.end_image_url = end_image_url;
    if (image_urls && image_urls.length > 0) body.image_urls = image_urls;
    if (elements && elements.length > 0) body.elements = elements;
    if (multi_shot !== undefined) body.multi_shot = multi_shot;
    if (shot_type) body.shot_type = shot_type;
    if (multi_prompt && multi_prompt.length > 0) body.multi_prompt = multi_prompt;
    if (generate_audio !== undefined) body.generate_audio = generate_audio;
    if (voice_ids && voice_ids.length > 0) body.voice_ids = voice_ids;
    if (aspect_ratio) body.aspect_ratio = aspect_ratio;
    if (duration !== undefined) body.duration = duration.toString();
    if (cfg_scale !== undefined) body.cfg_scale = cfg_scale;
    if (webhook_url) body.webhook_url = webhook_url;
    if (video_url) body.video_url = video_url;

    // Kling 3 Omni endpoint structure uses the suffix for generation
    const endpoint = video_url
      ? `https://api.freepik.com/v1/ai/reference-to-video/kling-v3-omni-${mode}`
      : `${KLING3_OMNI_BASE_API}-${mode}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('kling3-omni error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/kling3-omni/:taskId', async (req, res) => {
  try {
    const isReference = req.query.reference === 'true';
    const baseApi = isReference ? 'https://api.freepik.com/v1/ai/reference-to-video/kling-v3-omni' : KLING3_OMNI_BASE_API;
    const response = await fetch(`${baseApi}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('kling3-omni status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Kling 3 Motion Control (Async) ---
const KLING3_MOTION_BASE_API = 'https://api.freepik.com/v1/ai/video/kling-v3-motion-control';

app.post('/api/kling3-motion/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    if (mode !== 'pro' && mode !== 'std') {
      return res.status(400).json({ error: 'Invalid mode. Must be "pro" or "std"' });
    }

    const {
      image_url, video_url, prompt, character_orientation, cfg_scale, webhook_url
    } = req.body;

    if (!image_url || !video_url) {
      return res.status(400).json({ error: 'image_url and video_url are required' });
    }

    const body = { image_url, video_url };
    if (prompt) body.prompt = prompt;
    if (character_orientation) body.character_orientation = character_orientation;
    if (cfg_scale !== undefined) body.cfg_scale = cfg_scale;
    if (webhook_url) body.webhook_url = webhook_url;

    const endpoint = `${KLING3_MOTION_BASE_API}-${mode}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('kling3-motion error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/kling3-motion/:mode/:taskId', async (req, res) => {
  try {
    const { mode, taskId } = req.params;
    const response = await fetch(`${KLING3_MOTION_BASE_API}-${mode}/${taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('kling3-motion status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Kling O1 Video Generation (Async) ---
const KLING_O1_BASE_API = 'https://api.freepik.com/v1/ai/image-to-video/kling-o1';

app.post('/api/kling-o1/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    if (mode !== 'pro' && mode !== 'std') {
      return res.status(400).json({ error: 'Invalid mode. Must be "pro" or "std"' });
    }

    const {
      first_frame, last_frame, prompt, aspect_ratio, duration, webhook_url
    } = req.body;

    if (!first_frame && !last_frame) {
      return res.status(400).json({ error: 'At least one frame (first_frame or last_frame) is required' });
    }

    const body = {};
    if (first_frame) body.first_frame = first_frame;
    if (last_frame) body.last_frame = last_frame;
    if (prompt) body.prompt = prompt;
    if (aspect_ratio) body.aspect_ratio = aspect_ratio;
    if (duration !== undefined) body.duration = duration;
    if (webhook_url) body.webhook_url = webhook_url;

    const endpoint = `${KLING_O1_BASE_API}-${mode}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('kling-o1 error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/kling-o1/:taskId', async (req, res) => {
  try {
    const response = await fetch(`https://api.freepik.com/v1/ai/image-to-video/kling-o1/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('kling-o1 status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- MiniMax Live Video Generation (Async) ---
const MINIMAX_LIVE_BASE_API = 'https://api.freepik.com/v1/ai/image-to-video/minimax-live';

app.post('/api/minimax-live', async (req, res) => {
  try {
    const { image_url, prompt, prompt_optimizer, webhook_url } = req.body;

    if (!image_url || !prompt) {
      return res.status(400).json({ error: 'image_url and prompt are required' });
    }

    const body = { image_url, prompt };
    if (prompt_optimizer !== undefined) body.prompt_optimizer = prompt_optimizer;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(MINIMAX_LIVE_BASE_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('minimax-live error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/minimax-live/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${MINIMAX_LIVE_BASE_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('minimax-live status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- WAN 2.6 Video Generation (Async) ---
app.post('/api/wan-v2-6/:mode/:resolution', async (req, res) => {
  try {
    const { mode, resolution } = req.params;
    if (!['image-to-video', 'text-to-video'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode. Must be "image-to-video" or "text-to-video"' });
    }
    if (!['720p', '1080p'].includes(resolution)) {
      return res.status(400).json({ error: 'Invalid resolution. Must be "720p" or "1080p"' });
    }

    const { prompt, image, size, duration, negative_prompt, enable_prompt_expansion, shot_type, seed, webhook_url } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }
    if (mode === 'image-to-video' && !image) {
      return res.status(400).json({ error: 'image is required for image-to-video mode' });
    }

    const body = { prompt };
    if (image && mode === 'image-to-video') body.image = image;
    if (size) body.size = size;
    if (duration !== undefined) body.duration = duration.toString();
    if (negative_prompt) body.negative_prompt = negative_prompt;
    if (enable_prompt_expansion !== undefined) body.enable_prompt_expansion = enable_prompt_expansion;
    if (shot_type) body.shot_type = shot_type;
    if (seed !== undefined) body.seed = seed;
    if (webhook_url) body.webhook_url = webhook_url;

    const endpoint = `https://api.freepik.com/v1/ai/${mode}/wan-v2-6-${resolution}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('wan-v2-6 error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/wan-v2-6/:mode/:resolution/:taskId', async (req, res) => {
  try {
    const { mode, resolution, taskId } = req.params;
    // Note: Documentation usually has GET endpoints like /v1/ai/image-to-video/wan-v2-6-720p/{taskId}
    const endpoint = `https://api.freepik.com/v1/ai/${mode}/wan-v2-6-${resolution}/${taskId}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('wan-v2-6 status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Seedance 1.5 Pro Video Generation (Async) ---
app.post('/api/seedance-1-5-pro/:resolution', async (req, res) => {
  try {
    const { resolution } = req.params;
    if (!['720p', '1080p'].includes(resolution)) {
      return res.status(400).json({ error: 'Invalid resolution. Must be "720p" or "1080p"' });
    }

    const { prompt, image, duration, generate_audio, camera_fixed, aspect_ratio, seed, webhook_url } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const body = { prompt };
    if (image) body.image = image;
    if (duration !== undefined) body.duration = duration;
    if (generate_audio !== undefined) body.generate_audio = generate_audio;
    if (camera_fixed !== undefined) body.camera_fixed = camera_fixed;
    if (aspect_ratio) body.aspect_ratio = aspect_ratio;
    if (seed !== undefined) body.seed = seed;
    if (webhook_url) body.webhook_url = webhook_url;

    const endpoint = `https://api.freepik.com/v1/ai/video/seedance-1-5-pro-${resolution}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('seedance-1-5-pro error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/seedance-1-5-pro/:resolution/:taskId', async (req, res) => {
  try {
    const { resolution, taskId } = req.params;
    const endpoint = `https://api.freepik.com/v1/ai/video/seedance-1-5-pro-${resolution}/${taskId}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('seedance-1-5-pro status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- LTX Video 2.0 Pro Video Generation (Async) ---
app.post('/api/ltx-2-pro/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    if (!['image-to-video', 'text-to-video'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode. Must be "image-to-video" or "text-to-video"' });
    }

    const { prompt, image_url, resolution, duration, fps, generate_audio, seed, webhook_url } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    if (mode === 'image-to-video' && !image_url) {
      return res.status(400).json({ error: 'image_url is required for image-to-video mode' });
    }

    const body = { prompt };
    if (image_url && mode === 'image-to-video') body.image_url = image_url;
    if (resolution) body.resolution = resolution;
    if (duration !== undefined) body.duration = duration;
    if (fps !== undefined) body.fps = fps;
    if (generate_audio !== undefined) body.generate_audio = generate_audio;
    if (seed !== undefined) body.seed = seed;
    if (webhook_url) body.webhook_url = webhook_url;

    const endpoint = `https://api.freepik.com/v1/ai/${mode}/ltx-2-pro`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('ltx-2-pro error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ltx-2-pro/:mode/:taskId', async (req, res) => {
  try {
    const { mode, taskId } = req.params;
    // According to standard Freepik API paths
    const endpoint = `https://api.freepik.com/v1/ai/${mode}/ltx-2-pro/${taskId}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('ltx-2-pro status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Runway Gen 4.5 Video Generation (Async) ---
app.post('/api/runway-4-5/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    if (!['image-to-video', 'text-to-video'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode. Must be "image-to-video" or "text-to-video"' });
    }

    const { prompt, image, ratio, duration, seed, webhook_url } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    if (mode === 'image-to-video' && !image) {
      return res.status(400).json({ error: 'image is required for image-to-video mode' });
    }

    const body = { prompt };
    if (image && mode === 'image-to-video') body.image = image;
    if (ratio) body.ratio = ratio;
    if (duration !== undefined) body.duration = duration;
    if (seed !== undefined && mode === 'image-to-video') body.seed = seed;
    if (webhook_url) body.webhook_url = webhook_url;

    const endpoint = `https://api.freepik.com/v1/ai/${mode}/runway-4-5`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('runway-gen-4.5 error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/runway-4-5/:mode/:taskId', async (req, res) => {
  try {
    const { mode, taskId } = req.params;
    const endpoint = `https://api.freepik.com/v1/ai/${mode}/runway-4-5/${taskId}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('runway-gen-4.5 status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Runway Gen4 Turbo Video Generation (Async) ---
const RUNWAY_GEN4_TURBO_API = 'https://api.freepik.com/v1/ai/image-to-video/runway-gen4-turbo';

app.post('/api/runway-gen4-turbo', async (req, res) => {
  try {
    const { image, ratio, duration, prompt, seed, webhook_url } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'image is required' });
    }

    const body = { image };
    if (ratio) body.ratio = ratio;
    if (duration !== undefined) body.duration = duration;
    if (prompt) body.prompt = prompt;
    if (seed !== undefined) body.seed = seed;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(RUNWAY_GEN4_TURBO_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('runway-gen4-turbo error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/runway-gen4-turbo/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${RUNWAY_GEN4_TURBO_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('runway-gen4-turbo status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Runway Act Two Video Generation (Async) ---
const RUNWAY_ACT_TWO_API = 'https://api.freepik.com/v1/ai/video/runway-act-two';

app.post('/api/runway-act-two', async (req, res) => {
  try {
    const { character, reference, ratio, body_control, expression_intensity, seed, webhook_url } = req.body;

    if (!character || !character.type || !character.uri) {
      return res.status(400).json({ error: 'character type and uri are required' });
    }
    if (!reference || !reference.type || !reference.uri) {
      return res.status(400).json({ error: 'reference type and uri are required' });
    }

    const body = { character, reference };
    if (ratio) body.ratio = ratio;
    if (body_control !== undefined) body.body_control = body_control;
    if (expression_intensity !== undefined) body.expression_intensity = expression_intensity;
    if (seed !== undefined) body.seed = seed;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(RUNWAY_ACT_TWO_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('runway-act-two error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/runway-act-two/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${RUNWAY_ACT_TWO_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('runway-act-two status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- VFX Video Processing (Async) ---
const VFX_API = 'https://api.freepik.com/v1/ai/video/vfx';

app.post('/api/vfx', async (req, res) => {
  try {
    const {
      video, filter_type, fps, bloom_filter_contrast,
      motion_filter_kernel_size, motion_filter_decay_factor, webhook_url
    } = req.body;

    if (!video) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    const body = { video };
    if (filter_type !== undefined) body.filter_type = filter_type;
    if (fps !== undefined) body.fps = fps;
    if (bloom_filter_contrast !== undefined) body.bloom_filter_contrast = bloom_filter_contrast;
    if (motion_filter_kernel_size !== undefined) body.motion_filter_kernel_size = motion_filter_kernel_size;
    if (motion_filter_decay_factor !== undefined) body.motion_filter_decay_factor = motion_filter_decay_factor;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(VFX_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('vfx error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vfx/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${VFX_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('vfx status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- PixVerse V5 Video Generation (Async) ---
const PIXVERSE_V5_API = 'https://api.freepik.com/v1/ai/image-to-video/pixverse-v5';

app.post('/api/pixverse-v5', async (req, res) => {
  try {
    const { image, prompt, aspect_ratio, resolution, motion_intensity, seed, webhook_url } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'image is required' });
    }

    const body = { image };
    if (prompt) body.prompt = prompt;
    if (aspect_ratio) body.aspect_ratio = aspect_ratio;
    if (resolution) body.resolution = resolution;
    if (motion_intensity !== undefined) body.motion_intensity = motion_intensity;
    if (seed !== undefined) body.seed = seed;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(PIXVERSE_V5_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('pixverse-v5 error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pixverse-v5/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${PIXVERSE_V5_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('pixverse-v5 status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- PixVerse V5 Video Transition (Async) ---
const PIXVERSE_V5_TRANSITION_API = 'https://api.freepik.com/v1/ai/image-to-video/pixverse-v5-transition';

app.post('/api/pixverse-v5-transition', async (req, res) => {
  try {
    const { first_image_url, last_image_url, prompt, resolution, duration, negative_prompt, seed, webhook_url } = req.body;

    if (!first_image_url || !last_image_url || !prompt) {
      return res.status(400).json({ error: 'first_image_url, last_image_url, and prompt are required' });
    }

    const body = { first_image_url, last_image_url, prompt };
    if (resolution) body.resolution = resolution;
    if (duration !== undefined) body.duration = duration;
    if (negative_prompt) body.negative_prompt = negative_prompt;
    if (seed !== undefined) body.seed = seed;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(PIXVERSE_V5_TRANSITION_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('pixverse-v5-transition error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pixverse-v5-transition/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${PIXVERSE_V5_TRANSITION_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('pixverse-v5-transition status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- OmniHuman 1.5 Video Generation (Async) ---
const OMNI_HUMAN_API = 'https://api.freepik.com/v1/ai/video/omni-human-1-5';

app.post('/api/omni-human-1-5', async (req, res) => {
  try {
    const { image_url, audio_url, prompt, turbo_mode, resolution, webhook_url } = req.body;

    if (!image_url || !audio_url) {
      return res.status(400).json({ error: 'image_url and audio_url are required' });
    }

    const body = { image_url, audio_url };
    if (prompt) body.prompt = prompt;
    if (turbo_mode !== undefined) body.turbo_mode = turbo_mode;
    if (resolution) body.resolution = resolution;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(OMNI_HUMAN_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('omni-human error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/omni-human-1-5/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${OMNI_HUMAN_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('omni-human status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Video Upscaler (Async) ---
app.post('/api/video-upscale/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    if (mode !== 'standard' && mode !== 'turbo') {
      return res.status(400).json({ error: 'Invalid mode. Must be "standard" or "turbo"' });
    }

    const { video, creativity, resolution, fps_boost, sharpen, smart_grain, flavor, webhook_url } = req.body;

    if (!video) {
      return res.status(400).json({ error: 'video is required' });
    }

    const body = { video };
    if (creativity !== undefined) body.creativity = creativity;
    if (resolution) body.resolution = resolution;
    if (fps_boost !== undefined) body.fps_boost = fps_boost;
    if (sharpen !== undefined) body.sharpen = sharpen;
    if (smart_grain !== undefined) body.smart_grain = smart_grain;
    if (flavor) body.flavor = flavor;
    if (webhook_url) body.webhook_url = webhook_url;

    const endpoint = mode === 'turbo' 
      ? 'https://api.freepik.com/v1/ai/video-upscaler/turbo'
      : 'https://api.freepik.com/v1/ai/video-upscaler';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('video-upscale error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/video-upscale/:taskId', async (req, res) => {
  try {
    // Both standard and turbo tasks are polled using the same GET endpoint
    const response = await fetch(`https://api.freepik.com/v1/ai/video-upscaler/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('video-upscale status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Precision Video Upscaler (Async) ---
const PRECISION_VIDEO_UPSCALER_API = 'https://api.freepik.com/v1/ai/video-upscaler-precision';

app.post('/api/video-upscaler-precision', async (req, res) => {
  try {
    const { video, resolution, fps_boost, sharpen, smart_grain, strength, webhook_url } = req.body;

    if (!video) {
      return res.status(400).json({ error: 'video is required' });
    }

    const body = { video };
    if (resolution) body.resolution = resolution;
    if (fps_boost !== undefined) body.fps_boost = fps_boost;
    if (sharpen !== undefined) body.sharpen = sharpen;
    if (smart_grain !== undefined) body.smart_grain = smart_grain;
    if (strength !== undefined) body.strength = strength;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(PRECISION_VIDEO_UPSCALER_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('video-upscaler-precision error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/video-upscaler-precision/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${PRECISION_VIDEO_UPSCALER_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('video-upscaler-precision status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- AI Icon Generation ---
app.post('/api/text-to-icon', async (req, res) => {
  try {
    const { prompt, style, format, num_inference_steps, guidance_scale, isPreview } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const body = { prompt };
    if (style) body.style = style;
    if (format && !isPreview) body.format = format;
    if (num_inference_steps !== undefined) body.num_inference_steps = num_inference_steps;
    if (guidance_scale !== undefined) body.guidance_scale = guidance_scale;

    // Use a dummy webhook URL since we're going to poll anyway to keep consistency
    body.webhook_url = 'https://example.com/webhook';

    const endpoint = isPreview
      ? 'https://api.freepik.com/v1/ai/text-to-icon/preview'
      : 'https://api.freepik.com/v1/ai/text-to-icon';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    if (isPreview) {
      res.json(data);
    } else {
      res.json(data);
    }
  } catch (err) {
    console.error('text-to-icon error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Notice: In the Freepik API for text-to-icon, the render endpoint returns the actual image.
// We'll wrap it to poll and fetch the image. The documentation mentions polling, but the endpoint for GET is usually common or we just wait for webhook.
// Since the prompt shows polling is standard: `GET /v1/ai/text-to-icon/{task-id}/render/{format}`. But wait, `render` implies generating it now.
// Let's implement the specific get-task status if it exists, but the documentation only shows POST for preview and POST for render.
// "Poll for results or receive a webhook notification when the icon is ready."
// But the endpoints listed are:
// POST /v1/ai/text-to-icon
// POST /v1/ai/text-to-icon/preview
// POST /v1/ai/text-to-icon/{task-id}/render/{format} -> actually the docs say "Download icon in PNG or SVG format" for this.
// So we'll add an endpoint to trigger that.

app.get('/api/text-to-icon/:taskId/render/:format', async (req, res) => {
  try {
    const response = await fetch(`https://api.freepik.com/v1/ai/text-to-icon/${req.params.taskId}/render/${req.params.format}`, {
      method: 'POST', // The docs say POST /v1/ai/text-to-icon/{task-id}/render/{format}
      headers: freepikHeaders,
    });
    
    // This might return binary data or a JSON with a URL. Let's assume JSON with generated array for consistency with other Freepik APIs based on the schema `get_style_transfer_task_status_200_response` provided in the YAML.
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('text-to-icon render error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/text-to-icon/:taskId', async (req, res) => {
  // It seems there's no dedicated GET endpoint for task status documented in the card for text-to-icon.
  // But the OpenAPI spec mentions responses for POST text-to-icon return task status.
  // We'll implement a generic status checker if needed, but it might not exist.
  // Let's assume there is a generic GET or we just use the POST response.
  // Actually, the YAML only has POST /v1/ai/text-to-icon.
  // "Success - The request has succeeded and the Text to Icon process has started." -> returns task_id and status: IN_PROGRESS
  // "Poll for results..." -> usually GET /v1/ai/text-to-icon/{task-id}, though omitted from the yaml. Let's provide a mock polling endpoint.
  try {
    const response = await fetch(`https://api.freepik.com/v1/ai/text-to-icon/${req.params.taskId}`, {
       method: 'GET',
       headers: freepikHeaders,
    });
    if (!response.ok) {
        // Fallback: if GET doesn't exist, we might need to handle it differently, but Freepik APIs are uniform.
        return res.status(response.status).json({ error: await response.text() });
    }
    res.json(await response.json());
  } catch (err) {
    console.error('text-to-icon status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Image to Prompt (Async) ---
const IMAGE_TO_PROMPT_API = 'https://api.freepik.com/v1/ai/image-to-prompt';

app.post('/api/image-to-prompt', async (req, res) => {
  try {
    const { image, webhook_url } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'image is required' });
    }

    const body = { image };
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(IMAGE_TO_PROMPT_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('image-to-prompt error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/image-to-prompt/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${IMAGE_TO_PROMPT_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('image-to-prompt status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- AI Image Classifier ---
const AI_CLASSIFIER_API = 'https://api.freepik.com/v1/ai/classifier/image';

app.post('/api/classifier/image', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'image is required' });
    }

    const response = await fetch(AI_CLASSIFIER_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify({ image }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('ai-classifier error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Improve Prompt (Async) ---
const IMPROVE_PROMPT_API = 'https://api.freepik.com/v1/ai/improve-prompt';

app.post('/api/improve-prompt', async (req, res) => {
  try {
    const { prompt, type, language, webhook_url } = req.body;

    if (!type || (type !== 'image' && type !== 'video')) {
      return res.status(400).json({ error: 'type must be "image" or "video"' });
    }

    const body = { type };
    if (prompt !== undefined) body.prompt = prompt; // can be empty
    if (language) body.language = language;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(IMPROVE_PROMPT_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('improve-prompt error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/improve-prompt/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${IMPROVE_PROMPT_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('improve-prompt status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- ElevenLabs Music Generation (Async) ---
const MUSIC_GENERATION_API = 'https://api.freepik.com/v1/ai/music-generation';

app.post('/api/music-generation', async (req, res) => {
  try {
    const { prompt, music_length_seconds, webhook_url } = req.body;

    if (!prompt || !music_length_seconds) {
      return res.status(400).json({ error: 'prompt and music_length_seconds are required' });
    }

    const body = { prompt, music_length_seconds };
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(MUSIC_GENERATION_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('music-generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/music-generation/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${MUSIC_GENERATION_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('music-generation status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- ElevenLabs Sound Effects (Async) ---
const SOUND_EFFECTS_API = 'https://api.freepik.com/v1/ai/sound-effects';

app.post('/api/sound-effects', async (req, res) => {
  try {
    const { text, duration_seconds, loop, prompt_influence, webhook_url } = req.body;

    if (!text || duration_seconds === undefined) {
      return res.status(400).json({ error: 'text and duration_seconds are required' });
    }

    const body = { text, duration_seconds };
    if (loop !== undefined) body.loop = loop;
    if (prompt_influence !== undefined) body.prompt_influence = prompt_influence;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(SOUND_EFFECTS_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('sound-effects error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sound-effects/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${SOUND_EFFECTS_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('sound-effects status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Audio Isolation (SAM Audio) (Async) ---
const AUDIO_ISOLATION_API = 'https://api.freepik.com/v1/ai/audio-isolation';

app.post('/api/audio-isolation', async (req, res) => {
  try {
    const { description, audio, video, x1, y1, x2, y2, sample_fps, reranking_candidates, predict_spans, webhook_url } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'description is required' });
    }
    
    if (!audio && !video) {
      return res.status(400).json({ error: 'Either audio or video must be provided' });
    }

    const body = { description };
    if (audio) body.audio = audio;
    if (video) body.video = video;
    if (x1 !== undefined) body.x1 = x1;
    if (y1 !== undefined) body.y1 = y1;
    if (x2 !== undefined) body.x2 = x2;
    if (y2 !== undefined) body.y2 = y2;
    if (sample_fps !== undefined) body.sample_fps = sample_fps;
    if (reranking_candidates !== undefined) body.reranking_candidates = reranking_candidates;
    if (predict_spans !== undefined) body.predict_spans = predict_spans;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(AUDIO_ISOLATION_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('audio-isolation error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/audio-isolation/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${AUDIO_ISOLATION_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('audio-isolation status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- ElevenLabs Voiceover (Async) ---
const VOICEOVER_API = 'https://api.freepik.com/v1/ai/voiceover/elevenlabs-turbo-v2-5';

app.post('/api/voiceover', async (req, res) => {
  try {
    const { text, voice_id, stability, similarity_boost, speed, use_speaker_boost, webhook_url } = req.body;

    if (!text || !voice_id) {
      return res.status(400).json({ error: 'text and voice_id are required' });
    }

    const body = { text, voice_id };
    if (stability !== undefined) body.stability = stability;
    if (similarity_boost !== undefined) body.similarity_boost = similarity_boost;
    if (speed !== undefined) body.speed = speed;
    if (use_speaker_boost !== undefined) body.use_speaker_boost = use_speaker_boost;
    if (webhook_url) body.webhook_url = webhook_url;

    const response = await fetch(VOICEOVER_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('voiceover error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Assuming status endpoint exists at similar path pattern or same root taskId
// We'll map to standard FREPIC async taskId polling structure:
// But wait, the docs say GET /v1/ai/voiceover/{task-id} 
const VOICEOVER_POLL_API = 'https://api.freepik.com/v1/ai/voiceover';

app.get('/api/voiceover/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${VOICEOVER_POLL_API}/${req.params.taskId}`, {
      method: 'GET',
      headers: freepikHeaders,
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('voiceover status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Image upload endpoint ---
app.post('/api/upload-image', upload.array('images', 15), (req, res) => {
  try {
    const dataUrls = req.files.map((file) => {
      const base64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${base64}`;
    });
    res.json({ images: dataUrls });
  } catch (err) {
    console.error('upload error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ── Group Editing Mock Route ──
app.post('/api/group-edit', async (req, res) => {
  const { images, subjectPrompt, editPrompt, useVGGT, denoising } = req.body;
  if (!images || images.length === 0) {
    return res.status(400).json({ error: 'No images provided' });
  }
  
  try {
    // Simulated processing delay for the Wan-VACE model + VGGT extraction
    await new Promise(r => setTimeout(r, 4000));
    
    // Mock: just return the input images back to the user
    // In production, this would send the Base64 to a RunPod/Modal worker
    // running the DiffSynth-Studio GroupEditing Python pipeline.
    res.json({ images });
  } catch (err) {
    console.error('GroupEdit error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ── Facial Editing (PixelSmile) Mock Route ──
app.post('/api/facial-edit', async (req, res) => {
  const { image, emotion, intensity, strictIdentity, maskFace } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }
  
  try {
    // Simulated processing delay for Qwen-Image-Edit-2511 + PixelSmile LoRA
    await new Promise(r => setTimeout(r, 3000));
    
    // Mock: return the input image back to the user.
    // In production, this would hit a RunPod/Modal GPU instance running PixelSmile.
    res.json({ image });
  } catch (err) {
    console.error('FacialEdit error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
