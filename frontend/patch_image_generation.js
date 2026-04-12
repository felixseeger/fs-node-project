/* eslint-disable no-useless-escape */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiDir = path.join(__dirname, '../lib/api');

const validationFile = path.join(apiDir, 'middleware/validation.js');
let validationCode = fs.readFileSync(validationFile, 'utf8');

if (!validationCode.includes('negativePrompt:')) {
  const newValidators = `  negativePrompt: body('negative_prompt')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 4000 })
    .withMessage('Negative prompt must be a string with max 4000 characters'),
  
  imageUrls: body('image_urls')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Image URLs must be an array (max 5)'),
    
  imageUrlItem: body('image_urls.*')
    .optional()
    .isString()
    .isURL({ protocols: ['http', 'https', 'data'] })
    .withMessage('Invalid image URL format in array'),
    
  model: body('model')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Invalid model name format'),

  aspectRatio: body('aspect_ratio')
    .optional()
    .isString()
    .isIn(['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3', '4:5', '5:4'])
    .withMessage('Invalid aspect ratio'),

  resolution: body('resolution')
    .optional()
    .isString()
    .isIn(['1K', '2K', '4K'])
    .withMessage('Invalid resolution'),

  numImages: body('num_images')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Number of images must be an integer between 1 and 4'),`;

  validationCode = validationCode.replace(
    /imageUrl: body\('image_url'\)/,
    newValidators + '\n\n  imageUrl: body(\'image_url\')'
  );
  fs.writeFileSync(validationFile, validationCode);
  console.log('Updated validation.js');
}

const imagesRouteFile = path.join(apiDir, 'routes/images.js');
let imagesRouteCode = fs.readFileSync(imagesRouteFile, 'utf8');

if (!imagesRouteCode.includes('validators.model')) {
  imagesRouteCode = imagesRouteCode.replace(
    /validate\(\[validators\.prompt\]\)/g,
    'validate([validators.prompt, validators.negativePrompt, validators.model, validators.aspectRatio, validators.resolution, validators.numImages, validators.imageUrls, validators.imageUrlItem])'
  );
  fs.writeFileSync(imagesRouteFile, imagesRouteCode);
  console.log('Updated images.js validation logic');
}

const freepikServiceFile = path.join(apiDir, 'services/freepik.js');
let freepikCode = fs.readFileSync(freepikServiceFile, 'utf8');

if (!freepikCode.includes('AbortController')) {
  // We need to add AbortController to apiRequest to enforce timeout
  const timeoutLogic = `
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout
  options.signal = controller.signal;
`;
  
  if (freepikCode.includes('const response = await fetch(url, {') && !freepikCode.includes('timeoutId')) {
    freepikCode = freepikCode.replace(
      /const response = await fetch\(url, \{/,
      timeoutLogic + '\n    const response = await fetch(url, {'
    );
    freepikCode = freepikCode.replace(
      /if \(\!response\.ok\) \{/,
      'clearTimeout(timeoutId);\n    if (!response.ok) {'
    );
    fs.writeFileSync(freepikServiceFile, freepikCode);
    console.log('Added timeout to freepik.js apiRequest');
  }
}

const googleServiceFile = path.join(apiDir, 'services/google.js');
let googleCode = fs.readFileSync(googleServiceFile, 'utf8');

if (!googleCode.includes('AbortController')) {
  // Add AbortController to fetch in google.js
  const timeoutLogic = `
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout
`;
  
  if (googleCode.includes('const response = await fetch(') && !googleCode.includes('timeoutId')) {
    googleCode = googleCode.replace(
      /const response = await fetch\(`https:\/\/generativelanguage\.googleapis\.com\/v1beta\/models\/imagen-4\.0-generate-001:predict\?key=\$\{apiKey\}`\, \{/,
      timeoutLogic + '\n    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {\n      signal: controller.signal,'
    );
    googleCode = googleCode.replace(
      /const data = await response\.json\(\)\;/,
      'clearTimeout(timeoutId);\n    const data = await response.json();'
    );
    fs.writeFileSync(googleServiceFile, googleCode);
    console.log('Added timeout to google.js generateImage fetch');
  }
}

console.log('Image generation hardening completed successfully.');
