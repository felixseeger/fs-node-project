const fs = require('fs');

const path = 'src/engine/executionEngine.ts';
let content = fs.readFileSync(path, 'utf-8');

if (!content.includes('import { deductCredits }')) {
  content = content.replace(
    "import { getExecutor, hasExecutor } from './executors';",
    "import { getExecutor, hasExecutor } from './executors';\nimport { deductCredits } from '../services/billingService';\nimport { getCostForOperation } from '../config/pricing';"
  );
}

const deductLogic = `
    // Deduct credits before execution if uid is present
    if (this.options.uid && node.type) {
      const cost = getCostForOperation(node.type); // Or based on model ID if stored in node.data
      if (cost > 0) {
        const success = await deductCredits(
          this.options.uid,
          cost,
          \`Execution of \${node.data?.label || node.type} node\`,
          node.type,
          node.data?.model as string || node.type
        );
        if (!success) {
          throw new Error('Insufficient credits. Please upgrade your plan or buy more credits.');
        }
      }
    }

    const context: ExecutionContext = {`;

if (!content.includes('deductCredits(')) {
  content = content.replace(
    'const context: ExecutionContext = {',
    deductLogic
  );
}

fs.writeFileSync(path, content, 'utf-8');
console.log('Patched executionEngine.ts');
