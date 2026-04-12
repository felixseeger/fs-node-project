const fs = require('fs');
let text = fs.readFileSync('src/engine/executors.ts', 'utf8');

text = text.replace(/import \* as logicExecutors from "\.\/logicExecutors";\n  registerExecutor\("condition", logicExecutors.conditionExecutor\);\n  registerExecutor\("iteration", logicExecutors.iterationExecutor\);\n  registerExecutor\("variable", logicExecutors.variableExecutor\);\n  registerExecutor\("socialPublisher", logicExecutors.socialPublisherExecutor\);\n  registerExecutor\("cloudSync", logicExecutors.cloudSyncExecutor\);\n/g, '');

text = "import * as logicExecutors from './logicExecutors';\n" + text;

text = text.replace(/registerExecutor\('router', routerExecutor\);\n\}/, "registerExecutor('router', routerExecutor);\n\n  // Logic & Flow\n  registerExecutor('condition', logicExecutors.conditionExecutor);\n  registerExecutor('iteration', logicExecutors.iterationExecutor);\n  registerExecutor('variable', logicExecutors.variableExecutor);\n  registerExecutor('socialPublisher', logicExecutors.socialPublisherExecutor);\n  registerExecutor('cloudSync', logicExecutors.cloudSyncExecutor);\n}");

fs.writeFileSync('src/engine/executors.ts', text);
console.log('Fixed executors.ts');
