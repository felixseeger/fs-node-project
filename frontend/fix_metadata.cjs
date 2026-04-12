const fs = require('fs');
let text = fs.readFileSync('src/engine/executors.ts', 'utf8');

const metadata = `
  // Logic & Flow
  condition: {
    category: NodeCategory.UTILITY,
    displayName: 'Condition',
    inputs: ['input'],
    outputs: ['true_out', 'false_out'],
    isAsync: false,
  },
  iteration: {
    category: NodeCategory.UTILITY,
    displayName: 'Iteration',
    inputs: ['array_in'],
    outputs: ['item_out'],
    isAsync: false,
  },
  variable: {
    category: NodeCategory.UTILITY,
    displayName: 'Variable',
    inputs: ['val_in'],
    outputs: ['val_out'],
    isAsync: false,
  },
  socialPublisher: {
    category: NodeCategory.UTILITY,
    displayName: 'Social Publisher',
    inputs: ['media_in', 'caption_in'],
    outputs: ['result'],
    isAsync: true,
  },
  cloudSync: {
    category: NodeCategory.UTILITY,
    displayName: 'Cloud Sync',
    inputs: ['media_in'],
    outputs: ['result'],
    isAsync: true,
  },
`;

if (!text.includes("condition: {")) {
    text = text.replace("};", metadata + "\n};");
}

fs.writeFileSync('src/engine/executors.ts', text);
console.log('Fixed metadata!');
