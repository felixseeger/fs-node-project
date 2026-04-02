/**
 * Execution Engine
 * Dependency graph-based parallel execution engine for AI Pipeline Editor
 */

// Core types
export {
  ExecutionStatus,
  NodeCategory,
  type NodeExecutionState,
  type ExecutionContext,
  type NodeExecutor,
  type ExecutionOptions,
  type ExecutionStats,
  type EngineExecutionResult,
  type DependencyGraph,
  type ExecutionBatch,
  type ProgressCallback,
  type NodeTypeMetadata,
} from './types';

// Dependency graph utilities
export {
  buildDependencyGraph,
  detectCircularDependency,
  getRootNodes,
  getReadyNodes,
  calculateNodeDepths,
  createExecutionBatches,
  topologicalSort,
  getExecutionOrder,
  findPaths,
  getCriticalPath,
} from './dependencyGraph';

// Executor registry
export {
  getNodeMetadata,
  registerExecutor,
  getExecutor,
  hasExecutor,
  unregisterExecutor,
  registerBuiltinExecutors,
  NODE_TYPE_METADATA,
} from './executors';

// Execution engine
export { ExecutionEngine, createExecutionEngine } from './executionEngine';

// React hook
export { useExecutionEngine, type UseExecutionEngineReturn, type UseExecutionEngineOptions } from '../hooks/useExecutionEngine';
