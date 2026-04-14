const fs = require('fs');
const path = 'lib/api/routes/billing.js';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('Idempotency check')) {
    const importRedis = "import redis from '../utils/redis.js';\n";
    if (!content.includes('import redis')) {
        content = content.replace("import express from 'express';", "import express from 'express';\n" + importRedis);
    }
    
    const idempotencyCheck = `
  // Idempotency check to prevent double-crediting
  const eventId = event.id;
  if (eventId) {
    const isProcessed = await redis.setnx(\`webhook_processed:\${eventId}\`, '1');
    if (!isProcessed) {
      console.log(\`[Billing] Webhook event \${eventId} already processed, skipping.\`);
      return res.json({ received: true });
    }
    // Expire the idempotency key after 7 days
    await redis.expire(\`webhook_processed:\${eventId}\`, 86400 * 7);
  }
`;
    content = content.replace('// Handle the event', idempotencyCheck + '\n  // Handle the event');
    fs.writeFileSync(path, content);
    console.log('Billing route patched.');
} else {
    console.log('Already patched.');
}
