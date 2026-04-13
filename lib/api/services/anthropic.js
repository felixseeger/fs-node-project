/**
 * Anthropic Claude API Service
 * Handles all communication with Anthropic's Claude API (vision, analysis)
 */

import Anthropic from '@anthropic-ai/sdk';

let anthropicInstance = null;

function getAnthropic() {
  if (!anthropicInstance) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set');
    }
    anthropicInstance = new Anthropic({ apiKey: key });
  }
  return anthropicInstance;
}

/**
 * Helper to format images for Claude API
 */
export function formatImagesForClaude(images) {
  const content = [];
  const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  for (const img of images) {
    if (typeof img !== 'string') continue;
    
    if (img.startsWith('data:')) {
      try {
        const parts = img.split(',');
        if (parts.length !== 2) continue;

        const header = parts[0];
        const base64 = parts[1];
        
        const match = header.match(/data:(.*);/);
        if (!match || !match[1]) continue;

        const mediaType = match[1];
        if (!supportedTypes.includes(mediaType)) {
          console.warn(`[Anthropic] Unsupported media type: ${mediaType}`);
          continue;
        }

        content.push({
          type: 'image',
          source: { 
            type: 'base64', 
            media_type: mediaType, 
            data: base64 
          },
        });
      } catch (e) {
        console.warn('[Anthropic] Failed to parse base64 image:', e.message);
      }
    } else if (img.startsWith('http')) {
      // Claude API typically requires base64 for images in the messages array, 
      // but some versions might support URLs. Sonnet 3.5 requires base64.
      // We'll keep this as a placeholder or log a warning if we know it needs base64.
      console.warn('[Anthropic] Image URLs are not directly supported by this service, use base64');
    }
  }
  return content;
}

/**
 * Analyze images using Claude Sonnet Vision
 * @param {Object} params
 * @param {string[]} params.images - Array of image URLs or base64 data URIs
 * @param {string} params.prompt - Analysis prompt/question
 * @param {string} params.systemDirections - System instructions for Claude
 * @returns {Promise<string>} Analysis text
 */
export async function analyzeImage({ images, prompt, systemDirections }) {
  if (!images || images.length === 0) {
    throw new Error('At least one image is required');
  }

  const content = [
    ...formatImagesForClaude(images),
    {
      type: 'text',
      text: prompt || 'Analyze this image in detail.',
    }
  ];

  const anthropic = getAnthropic();
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemDirections || 'You are an expert image analyst. Provide detailed, useful analysis.',
    messages: [{ role: 'user', content }],
  });

  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
}

/**
 * Generic text completion with Claude
 * @param {Object} params
 * @param {string} params.prompt - Current user text prompt
 * @param {string} params.system - System instructions
 * @param {Array} params.history - Optional chat history [{role: 'user'|'assistant', content: string}]
 * @param {string[]} params.images - Optional array of image URLs or base64 data URIs
 * @param {number} params.maxTokens - Maximum tokens to generate
 * @returns {Promise<string>} Generated text
 */
export async function generateText({ prompt, system, history = [], images = [], maxTokens = 2048 }) {
  const anthropic = getAnthropic();
  
  let currentContent = prompt;
  if (images && images.length > 0) {
    currentContent = [
      ...formatImagesForClaude(images),
      { type: 'text', text: prompt }
    ];
  }

  // Build messages array
  const messages = [
    ...history.map(m => ({
      role: m.role,
      content: m.content
    })),
    { role: 'user', content: currentContent }
  ];

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: maxTokens,
    system: system || 'You are a helpful assistant.',
    messages,
  });

  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
}

export { getAnthropic as anthropic };
