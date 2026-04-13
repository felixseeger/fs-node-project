/**
 * Sanitization utility to strip sensitive information from exports in the frontend.
 */

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
    /sk-[a-zA-Z0-9]{20,}/g, // Generic sk- prefix
    /AIza[0-9A-Za-z\\-_]{35}/g, // Google API Key
    /[a-f0-9]{32}/g, // 32-char hex
    /gh[pous]_[a-zA-Z0-9]{36}/g // GitHub tokens
  ];

  patterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, placeholder);
  });

  return sanitized;
}
