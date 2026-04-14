import * as dotenv from 'dotenv';
dotenv.config({ path: 'api/.env' });
import { generateImage } from './lib/api/services/google.js';
generateImage({ prompt: 'sunset', n: 1 }).then(console.log).catch(console.error);
