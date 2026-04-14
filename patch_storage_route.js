import fs from 'fs';
const p = 'lib/api/routes/index.js';
let code = fs.readFileSync(p, 'utf8');
code = code.replace("import render from './render.js';", "import render from './render.js';\nimport storage from './storage.js';");
code = code.replace("router.use('/api', requireAuth, auditMiddleware(), render);", "router.use('/api', requireAuth, auditMiddleware(), render);\nrouter.use('/api', requireAuth, auditMiddleware(), storage);");
fs.writeFileSync(p, code);
