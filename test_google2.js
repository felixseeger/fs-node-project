import * as dotenv from 'dotenv';
dotenv.config({ path: 'api/.env' });
import { generateImage } from './lib/api/services/google.js';
process.env.GOOGLE_IMAGEN_MODEL = 'imagen-3.0-generate-002';
generateImage({ prompt: 'sunset', n: 1 }).then(console.log).catch(console.error);
