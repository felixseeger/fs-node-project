import fs from 'fs';
let content = fs.readFileSync('src/components/SystemLoadingProcess.tsx', 'utf-8');

// 1. add to props
content = content.replace(
  'interface SystemLoadingProcessProps {',
  'interface SystemLoadingProcessProps {\n  progress?: number;'
);

// 2. add to destructuring
content = content.replace(
  'const SystemLoadingProcess: FC<SystemLoadingProcessProps> = ({\n  isProcessing = false,',
  'const SystemLoadingProcess: FC<SystemLoadingProcessProps> = ({\n  isProcessing = false,\n  progress,'
);

fs.writeFileSync('src/components/SystemLoadingProcess.tsx', content);
console.log("Patched SystemLoadingProcess.tsx");
