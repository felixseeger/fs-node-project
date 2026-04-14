import fs from 'fs';

const creditsPath = 'lib/api/utils/credits.js';
let code = fs.readFileSync(creditsPath, 'utf8');

if (!code.includes('logAuditEvent')) {
  code = `import { logAuditEvent } from '../services/auditLogger.js';\n` + code;
  
  // Add logging to deductCredits
  code = code.replace(
    'return newBalance;',
    `// Audit logging
    logAuditEvent({
      action: 'DEDUCT_CREDITS',
      userId: uid,
      details: { amount, newBalance, isNewUser },
      status: 'SUCCESS'
    });
    return newBalance;`
  );

  // Add logging to addCredits
  code = code.replace(
    'if (isPro) {',
    `// Audit logging
  logAuditEvent({
    action: 'ADD_CREDITS',
    userId: uid,
    details: { amount, isPro },
    status: 'SUCCESS'
  });
  
  if (isPro) {`
  );

  fs.writeFileSync(creditsPath, code);
  console.log('Patched credits.js');
} else {
  console.log('Already patched');
}
