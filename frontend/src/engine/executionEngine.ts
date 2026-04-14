/**
 * Execution Engine
 * Dependency graph-based parallel execution engine for workflow nodes
 */

import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '../types';
import {
  type ExecutionContext,
  type ExecutionOptions,
  type EngineExecutionResult,
  type NodeExecutionState,
  type ProgressCallback,
  type ExecutionStats,
  ExecutionStatus,
} from './types';
import {
  buildDependencyGraph,
  detectCircularDependency,
  createExecutionBatches,
  getReadyNodes,
} from './dependencyGraph';
import { getExecutor, hasExecutor } from './executors';

/** Default execution options */
const DEFAULT_OPTIONS: Required<ExecutionOptions> = {
  maxConcurrency: 4,
  parallel: true,
  continueOnError: false,
  nodeTimeout: 600000, // 10 minutes
  globalTimeout: 3600000, // 1 hour
  verbose: false,
};

/** Execution Engine class */
export class ExecutionEngine {
  private options: Required<ExecutionOptions>;
  private abortController: AbortController | null = null;
  private nodeStates: Map<string, NodeExecutionState> = new Map();
  private outputs: Map<string, unknown> = new Map();
  private nodes: Node<NodeData>[] = [];
  private edges: Edge[] = [];
  private updateNodeDataFn: ((nodeId: string, updates: Partial<NodeData>) => void) | null = null;
  private progressCallback: ProgressCallback | null = null;

  constructor(options: ExecutionOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /** Set the node data update function */
  setUpdateNodeData(fn: (nodeId: string, updates: Partial<NodeData>) => void): void {
    this.updateNodeDataFn = fn;
  }

  /** Set progress callback */
  setProgressCallback(callback: ProgressCallback): void {
    this.progressCallback = callback;
  }

  /** Execute a workflow */
  async execute(
    nodes: Node<NodeData>[],
    edges: Edge[]
  ): Promise<EngineExecutionResult> {
    this.nodes = nodes;
    this.edges = edges;
    this.nodeStates.clear();
    this.outputs.clear();

    // Initialize node states
    for (const node of nodes) {
      this.nodeStates.set(node.id, {
        status: ExecutionStatus.IDLE,
      });
    }

    // Create abort controller
    this.abortController = new AbortController();

    const stats: ExecutionStats = {
      startTime: Date.now(),
      totalNodes: nodes.length,
      completedNodes: 0,
      failedNodes: 0,
      skippedNodes: 0,
      parallelBatches: 0,
    };

    try {
      // Check for circular dependencies
      const graph = buildDependencyGraph(nodes, edges);
      const cycle = detectCircularDependency(graph);
      if (cycle) {
        throw new Error(`Circular dependency detected: ${cycle.join(' -> ')}`);
      }

      // Emit start event
      this.emitProgress('start', { message: 'Execution started' });

      // Set global timeout if specified
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      if (this.options.globalTimeout > 0) {
        timeoutId = setTimeout(() => {
          this.abortController?.abort('Global timeout exceeded');
        }, this.options.globalTimeout);
      }

      // Execute based on mode
      if (this.options.parallel) {
        await this.executeParallel(graph, stats);
      } else {
        await this.executeSequential(graph, stats);
      }

      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      stats.endTime = Date.now();

      const success = stats.failedNodes === 0;

      this.emitProgress('complete', {
        message: success ? 'Execution completed successfully' : 'Execution completed with errors',
        progress: 100,
      });

      return {
        success,
        stats,
        nodeStates: new Map(this.nodeStates),
        outputs: new Map(this.outputs),
      };
    } catch (error) {
      stats.endTime = Date.now();
      const errorMessage = error instanceof Error ? error.message : String(error);

      this.emitProgress('error', {
        message: errorMessage,
        error: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
        stats,
        nodeStates: new Map(this.nodeStates),
        outputs: new Map(this.outputs),
      };
    } finally {
      this.abortController = null;
    }
  }

  /** Execute nodes in parallel batches */
  private async executeParallel(
    graph: ReturnType<typeof buildDependencyGraph>,
    stats: ExecutionStats
  ): Promise<void> {
    const batches = createExecutionBatches(graph);
    stats.parallelBatches = batches.length;

    const completedNodes = new Set<string>();

    for (const batch of batches) {
      if (this.isCancelled()) {
        throw new Error('Execution cancelled');
      }

      this.emitProgress('batch-start', {
        batchIndex: batch.index,
        totalBatches: batches.length,
        message: `Starting batch ${batch.index + 1}/${batches.length}`,
      });

      // Execute all nodes in this batch concurrently
      const promises = batch.nodeIds.map(async (nodeId) => {
        const node = this.nodes.find((n) => n.id === nodeId);
        if (!node) {
          throw new Error(`Node ${nodeId} not found`);
        }

        // Skip if no executor
        if (!hasExecutor(node.type || '')) {
          this.updateNodeState(nodeId, {
            status: ExecutionStatus.SKIPPED,
            message: 'No executor available',
          });
          stats.skippedNodes++;
          return;
        }

        try {
          await this.executeNode(node);
          completedNodes.add(nodeId);
          stats.completedNodes++;
        } catch (error) {
          stats.failedNodes++;
          if (!this.options.continueOnError) {
            throw error;
          }
        }
      });

      // Wait for all nodes in batch with concurrency limit
      await this.runWithConcurrency(promises, this.options.maxConcurrency);

      this.emitProgress('batch-complete', {
        batchIndex: batch.index,
        totalBatches: batches.length,
        message: `Completed batch ${batch.index + 1}/${batches.length}`,
      });
    }
  }

  /** Execute nodes sequentially in dependency order */
  private async executeSequential(
    graph: ReturnType<typeof buildDependencyGraph>,
    stats: ExecutionStats
  ): Promise<void> {
    const completedNodes = new Set<string>();

    while (completedNodes.size < this.nodes.length) {
      if (this.isCancelled()) {
        throw new Error('Execution cancelled');
      }

      // Get nodes that are ready to execute
      const readyNodes = getReadyNodes(graph, completedNodes).filter((nodeId) => {
        const state = this.nodeStates.get(nodeId);
        return state?.status === ExecutionStatus.IDLE;
      });

      if (readyNodes.length === 0) {
        // Check if we're stuck (no progress possible)
        const remainingNodes = this.nodes.filter(
          (n) => !completedNodes.has(n.id)
        );
        if (remainingNodes.length > 0) {
          throw new Error(
            `Deadlock detected: ${remainingNodes.map((n) => n.id).join(', ')}`
          );
        }
        break;
      }

      // Execute first ready node
      const nodeId = readyNodes[0];
      const node = this.nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      // Skip if no executor
      if (!hasExecutor(node.type || '')) {
        this.updateNodeState(nodeId, {
          status: ExecutionStatus.SKIPPED,
          message: 'No executor available',
        });
        completedNodes.add(nodeId);
        stats.skippedNodes++;
        continue;
      }

      try {
        await this.executeNode(node);
        completedNodes.add(nodeId);
        stats.completedNodes++;
      } catch (error) {
        stats.failedNodes++;
        if (!this.options.continueOnError) {
          throw error;
        }
        completedNodes.add(nodeId); // Mark as completed to avoid infinite loop
      }
    }
  }

  /** Execute a single node */
  private async executeNode(node: Node<NodeData>): Promise<void> {
    const nodeId = node.id;
    const executor = getExecutor(node.type || '');

    if (!executor) {
      throw new Error(`No executor registered for node type: ${node.type}`);
    }

    // Mark as running
    this.updateNodeState(nodeId, {
      status: ExecutionStatus.RUNNING,
      startTime: Date.now(),
      message: 'Starting...',
    });

    this.emitProgress('node-start', {
      nodeId,
      message: `Executing ${node.type}`,
    });

    // Create execution context
    const context = this.createExecutionContext();

    try {
      // Execute with timeout
      const result = await this.executeWithTimeout(
        () => executor(node, context),
        this.options.nodeTimeout
      );

      // Store output
      this.outputs.set(nodeId, result);

      // Mark as completed
      this.updateNodeState(nodeId, {
        status: ExecutionStatus.COMPLETED,
        endTime: Date.now(),
        result,
        message: 'Completed',
      });

      this.emitProgress('node-complete', {
        nodeId,
        message: `${node.type} completed`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Preserve credit requirement details if available
      const errorObject = {
        error: errorMessage,
        message: `Error: ${errorMessage}`,
      } as any;
      if (error instanceof Error && (error as any).status === 402) {
        errorObject.status = 402;
        errorObject.required = (error as any).required;
        errorObject.current = (error as any).current;
      }

      this.updateNodeState(nodeId, {
        status: ExecutionStatus.FAILED,
        endTime: Date.now(),
        error: errorMessage,
        message: `Error: ${errorMessage}`,
        // @ts-ignore
        details: errorObject
      });

      this.emitProgress('node-error', {
        nodeId,
        error: errorMessage,
        message: `${node.type} failed: ${errorMessage}`,
        // @ts-ignore
        details: errorObject
      });

      // Update node data with error
      this.updateNodeDataFn?.(nodeId, { error: errorMessage, isLoading: false });

      throw error;
    }
  }

  /** Create execution context for node executors */
  private createExecutionContext(): ExecutionContext {
    return {
      abortController: this.abortController!,
      nodes: this.nodes,
      edges: this.edges,
      updateNodeData: (nodeId, updates) => {
        this.updateNodeDataFn?.(nodeId, updates);
      },
      updateNodeState: (nodeId, state) => {
        this.updateNodeState(nodeId, state);
      },
      getInputs: (nodeId) => {
        return this.resolveInputs(nodeId);
      },
      getOutput: (nodeId) => {
        return this.outputs.get(nodeId);
      },
      isCancelled: () => this.isCancelled(),
      log: (level, message, meta) => {
        if (this.options.verbose) {
          console[level](`[ExecutionEngine] ${message}`, meta || '');
        }
      },
    };
  }

  /** Resolve inputs for a node from connected sources */
  private resolveInputs(nodeId: string): Record<string, unknown> {
    const inputs: Record<string, unknown> = {};

    // Find all incoming edges
    const incomingEdges = this.edges.filter((e) => e.target === nodeId);

    for (const edge of incomingEdges) {
      const handleId = edge.targetHandle || 'input';
      const sourceOutput = this.outputs.get(edge.source);

      if (sourceOutput !== undefined) {
        inputs[handleId] = sourceOutput;
      }
    }

    return inputs;
  }

  /** Execute a function with timeout */
  private async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    if (timeout <= 0) {
      return fn();
    }

    return Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Execution timeout after ${timeout}ms`));
        }, timeout);
      }),
    ]);
  }

  /** Run promises with concurrency limit */
  private async runWithConcurrency<T>(
    promises: Promise<T>[],
    concurrency: number
  ): Promise<T[]> {
    if (concurrency <= 0 || concurrency >= promises.length) {
      return Promise.all(promises);
    }

    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const promise of promises) {
      const p = promise.then((result) => {
        results.push(result);
      });

      executing.push(p);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
        executing.splice(
          executing.findIndex((ep) => ep === p),
          1
        );
      }
    }

    await Promise.all(executing);
    return results;
  }

  /** Update node execution state */
  private updateNodeState(
    nodeId: string,
    state: Partial<NodeExecutionState>
  ): void {
    const current = this.nodeStates.get(nodeId) || {
      status: ExecutionStatus.IDLE,
    };
    this.nodeStates.set(nodeId, { ...current, ...state });
  }

  /** Check if execution was cancelled */
  private isCancelled(): boolean {
    return this.abortController?.signal.aborted ?? false;
  }

  /** Emit progress event */
  private emitProgress(
    event: Parameters<ProgressCallback>[0],
    data: Parameters<ProgressCallback>[1]
  ): void {
    this.progressCallback?.(event, data);
  }

  /** Cancel current execution */
  cancel(): void {
    this.abortController?.abort('User cancelled');
  }

  /** Get current execution state */
  getNodeState(nodeId: string): NodeExecutionState | undefined {
    return this.nodeStates.get(nodeId);
  }

  /** Get all node states */
  getAllNodeStates(): Map<string, NodeExecutionState> {
    return new Map(this.nodeStates);
  }

  /** Get node output */
  getNodeOutput(nodeId: string): unknown {
    return this.outputs.get(nodeId);
  }
}

/** Create a new execution engine instance */
export function createExecutionEngine(options?: ExecutionOptions): ExecutionEngine {
  return new ExecutionEngine(options);
}

export default ExecutionEngine;
