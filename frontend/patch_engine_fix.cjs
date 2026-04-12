const fs = require('fs');

const pathHook = 'src/hooks/useExecutionEngine.ts';
let hookContent = fs.readFileSync(pathHook, 'utf-8');

if (!hookContent.includes("import { useAuth }")) {
  hookContent = hookContent.replace(
    "import { useCallback, useRef, useState, useMemo } from 'react';",
    "import { useCallback, useRef, useState, useMemo } from 'react';\nimport { useAuth } from '../context/AuthContext';"
  );
  
  hookContent = hookContent.replace(
    "export function useExecutionEngine(\n  options: UseExecutionEngineOptions = {}\n): UseExecutionEngineReturn {\n  const {",
    "export function useExecutionEngine(\n  options: UseExecutionEngineOptions = {}\n): UseExecutionEngineReturn {\n  const { user } = useAuth();\n  const {"
  );
  
  hookContent = hookContent.replace(
    'engineRef.current = createExecutionEngine({',
    'engineRef.current = createExecutionEngine({\n      uid: user?.uid,'
  );
}

fs.writeFileSync(pathHook, hookContent, 'utf-8');
console.log('Fixed useExecutionEngine hook');
