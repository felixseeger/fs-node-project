const fs = require('fs');

const pathTypes = 'src/engine/types.ts';
let typesContent = fs.readFileSync(pathTypes, 'utf-8');
if (!typesContent.includes('uid?: string;')) {
  typesContent = typesContent.replace(
    'export interface ExecutionOptions {',
    'export interface ExecutionOptions {\n  /** User ID for billing */\n  uid?: string;'
  );
  fs.writeFileSync(pathTypes, typesContent, 'utf-8');
}

const pathHook = 'src/hooks/useExecutionEngine.ts';
let hookContent = fs.readFileSync(pathHook, 'utf-8');
if (!hookContent.includes('import { useAuth } from')) {
  hookContent = hookContent.replace(
    "import { useCallback, useRef, useState, useMemo } from 'react';",
    "import { useCallback, useRef, useState, useMemo } from 'react';\nimport { useAuth } from '../context/AuthContext';"
  );
  
  hookContent = hookContent.replace(
    'export function useExecutionEngine(options: ExecutionOptions = {}): UseExecutionEngineReturn {',
    'export function useExecutionEngine(options: ExecutionOptions = {}): UseExecutionEngineReturn {\n  const { user } = useAuth();'
  );
  
  hookContent = hookContent.replace(
    'this.engineRef.current = createExecutionEngine(options);',
    'this.engineRef.current = createExecutionEngine({ ...options, uid: user?.uid });'
  );
  // Wait, the engine is created in a memo or ref? Let's check the actual hook code.
}

const hookEngineLine = 'engineRef.current = createExecutionEngine(options);';
if (hookContent.includes(hookEngineLine)) {
  hookContent = hookContent.replace(
    hookEngineLine,
    'engineRef.current = createExecutionEngine({ ...options, uid: user?.uid });'
  );
  fs.writeFileSync(pathHook, hookContent, 'utf-8');
}
console.log('Patched types and hook');
