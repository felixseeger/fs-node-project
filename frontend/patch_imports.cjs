const fs = require('fs');
const file = 'src/utils/dynamicNodeImports.ts';
let code = fs.readFileSync(file, 'utf8');

const newImports = `
// Expanded Node Library
const ConditionNode = lazy(() => (import('../nodes/ConditionNode') as any).catch((error: any) => {
  console.error('Failed to load ConditionNode:', error);
  throw error;
}));

const IterationNode = lazy(() => (import('../nodes/IterationNode') as any).catch((error: any) => {
  console.error('Failed to load IterationNode:', error);
  throw error;
}));

const VariableNode = lazy(() => (import('../nodes/VariableNode') as any).catch((error: any) => {
  console.error('Failed to load VariableNode:', error);
  throw error;
}));

const SocialPublisherNode = lazy(() => (import('../nodes/SocialPublisherNode') as any).catch((error: any) => {
  console.error('Failed to load SocialPublisherNode:', error);
  throw error;
}));

const CloudSyncNode = lazy(() => (import('../nodes/CloudSyncNode') as any).catch((error: any) => {
  console.error('Failed to load CloudSyncNode:', error);
  throw error;
}));
`;

const insertIndex = code.indexOf('export const dynamicNodes = {');
if (insertIndex !== -1) {
  code = code.slice(0, insertIndex) + newImports + '\n' + code.slice(insertIndex);
}

const exportIndex = code.indexOf('export const dynamicNodes = {');
const endExport = code.indexOf('};', exportIndex);
if (endExport !== -1) {
  const newExports = `
  // Expanded Node Library
  ConditionNode,
  IterationNode,
  VariableNode,
  SocialPublisherNode,
  CloudSyncNode,
`;
  code = code.slice(0, endExport) + newExports + code.slice(endExport);
}

fs.writeFileSync(file, code);
