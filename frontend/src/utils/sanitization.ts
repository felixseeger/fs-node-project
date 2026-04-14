import { Filter } from 'bad-words';

/**
 * Sanitization utility to strip sensitive information from exports in the frontend.
 * Also provides XSS protection for user-generated content.
 */

const profanityFilter = new Filter();

const SENSITIVE_KEYS = [
  'api_key',
  'apikey',
  'secret',
  'token',
  'password',
  'auth',
  'credential',
  'private_key'
];

/**
 * Recursively sanitizes an object or array by replacing values of sensitive keys.
 * @param {any} data - The data to sanitize.
 * @param {string} placeholder - The text to use as a placeholder.
 * @returns {any} Sanitized data.
 */
export function sanitizeData(data: any, placeholder = '{{REDACTED}}'): any {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, placeholder));
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = SENSITIVE_KEYS.some(sk => lowerKey.includes(sk));

      if (isSensitive && typeof value === 'string') {
        sanitized[key] = placeholder;
      } else {
        sanitized[key] = sanitizeData(value, placeholder);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Sanitizes a string (e.g., code snippet) using regex patterns for common secret formats.
 * @param {string} text - The text to sanitize.
 * @param {string} placeholder - The text to use as a placeholder.
 * @returns {string} Sanitized text.
 */
export function sanitizeString(text: string, placeholder = '{{REDACTED}}'): string {
  let sanitized = text;

  // Regex for common API key formats
  const patterns = [
    /sk-[a-zA-Z0-9]{20,}/g, // Generic sk- prefix (OpenAI, etc)
    /sk-ant-api03-[a-zA-Z0-9\-_]{80,}/g, // Anthropic API Key
    /AIza[0-9A-Za-z\-_]{35}/g, // Google API Key
    /[a-f0-9]{32}/g, // 32-char hex (often used for ElevenLabs, etc)
    /gh[pous]_[a-zA-Z0-9]{36}/g, // GitHub tokens
    /pk_[a-z0-9]{24,}/g, // Publishable keys (Stripe, etc)
    /secret_[a-z0-9]{24,}/g, // Secret keys
    /ey[a-zA-Z0-9-_]+\.ey[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+/g, // JWT tokens
  ];

  patterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, placeholder);
  });

  return sanitized;
}

/**
 * Sanitizes HTML to prevent XSS attacks while preserving safe text content.
 * Strips all HTML tags and attributes, returning only text content.
 * For chat messages and user-generated content that should be plain text.
 * 
 * @param {string} html - The HTML string to sanitize.
 * @returns {string} Sanitized text content with HTML tags removed.
 */
export function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined') {
    // SSR environment - basic regex stripping
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  }

  // Browser environment - use DOMParser for proper sanitization
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Get text content only (strips all HTML)
  return doc.body.textContent || '';
}

/**
 * Validates and sanitizes a chat message.
 * Enforces length limits and removes potentially dangerous content.
 * 
 * @param {string} message - The message to validate and sanitize.
 * @param {number} maxLength - Maximum allowed length (default: 2000).
 * @returns {{ valid: boolean; message: string; error?: string }} Validation result.
 */
export function sanitizeChatMessage(
  message: string, 
  maxLength: number = 2000
): { valid: boolean; message: string; error?: string } {
  if (!message || typeof message !== 'string') {
    return { valid: false, message: '', error: 'Message is required' };
  }

  // Trim whitespace
  let sanitized = message.trim();

  // Length validation
  if (sanitized.length > maxLength) {
    return { 
      valid: false, 
      message: '', 
      error: `Message exceeds ${maxLength} character limit` 
    };
  }

  // Strip HTML tags (chat should be plain text only)
  sanitized = sanitizeHTML(sanitized);

  // Remove null bytes and other control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Remove zero-width characters often used in invisible text attacks
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Profanity check
  if (profanityFilter.isProfane(sanitized)) {
    return {
      valid: false,
      message: '',
      error: 'Message contains inappropriate content (profanity)'
    };
  }

  return { valid: true, message: sanitized };
}
