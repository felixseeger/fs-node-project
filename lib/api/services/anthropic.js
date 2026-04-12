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
  for (const img of images) {
    if (typeof img !== 'string') continue;
    
    if (img.startsWith('data:')) {
      try {
        const [header, base64] = img.split(',');
        const mediaType = header.match(/data:(.*);/)[1];
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        });
      } catch (e) {
        console.warn('[Anthropic] Failed to parse base64 image:', e.message);
      }
    } else if (img.startsWith('http')) {
      content.push({
        type: 'image',
        source: { type: 'url', url: img },
      });
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
    model: 'claude-sonnet-4-20250514',
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
 * @param {string} params.prompt - Text prompt
 * @param {string} params.system - System instructions
 * @param {string[]} params.images - Optional array of image URLs or base64 data URIs
 * @param {number} params.maxTokens - Maximum tokens to generate
 * @returns {Promise<string>} Generated text
 */
export async function generateText({ prompt, system, images = [], maxTokens = 1024 }) {
  const anthropic = getAnthropic();
  
  let content = prompt;
  if (images && images.length > 0) {
    content = [
      ...formatImagesForClaude(images),
      { type: 'text', text: prompt }
    ];
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system: system || 'You are a helpful assistant.',
    messages: [{ role: 'user', content }],
  });

  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
}

export { getAnthropic as anthropic };
