import dotenv from 'dotenv';
dotenv.config({ path: '../api/.env' });
import * as freepik from '../lib/api/services/freepik.js';
freepik.improvePrompt('test prompt', undefined, undefined).then(console.log).catch(console.error);
