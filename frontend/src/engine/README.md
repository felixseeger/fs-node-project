# Execution Engine

A dependency graph-based parallel execution engine for the AI Pipeline Editor.

## Features

- **Dependency Graph Analysis**: Automatically builds dependency graphs from node connections
- **Parallel Execution**: Executes independent nodes concurrently for maximum performance
- **Circular Dependency Detection**: Prevents infinite loops by detecting cycles
- **Progress Tracking**: Real-time execution status and progress updates
- **Error Handling**: Graceful error handling with optional continue-on-error mode
- **Cancellation**: Support for aborting execution mid-run
- **Type-Safe**: Full TypeScript support with comprehensive type definitions

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React Flow    │────▶│  DependencyGraph │────▶│  ExecutionBatches│
│  (Nodes/Edges)  │     │   (Build/Sort)   │     │ (Parallel Groups)│
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                    ┌─────────────────────────────────────┘
                    ▼
           ┌─────────────────┐     ┌──────────────────┐
           │ ExecutionEngine │────▶│  Node Executors  │
           │ (Orchestration) │     │ (Type-specific)  │
           └─────────────────┘     └──────────────────┘
```

## Quick Start

### Using the React Hook

```tsx
import { useExecutionEngine } from '@/hooks';
import type { Node, Edge } from '@xyflow/react';

function WorkflowEditor() {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  const {
    isExecuting,
    progress,
    completedNodes,
    failedNodes,
    execute,
    cancel,
    isNodeExecuting,
    isNodeCompleted,
  } = useExecutionEngine({
    parallel: true,
    maxConcurrency: 4,
    continueOnError: false,
    onUpdateNodeData: (nodeId, updates) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
        )
      );
    },
    onProgress: (event, data) => {
      console.log(`[${event}] ${data.message}`);
    },
    onComplete: (result) => {
      console.log('Execution completed!', result.stats);
    },
    onError: (error) => {
      console.error('Execution failed:', error);
    },
  });

  const handleExecute = async () => {
    const result = await execute(nodes, edges);
    if (result.success) {
      // Handle success
    }
  };

  return (
    <div>
      <button onClick={handleExecute} disabled={isExecuting}>
        {isExecuting ? `Executing... ${progress}%` : 'Execute Workflow'}
      </button>
      {isExecuting && <button onClick={cancel}>Cancel</button>}
    </div>
  );
}
```

### Using the Engine Directly

```typescript
import { createExecutionEngine } from '@/engine';

const engine = createExecutionEngine({
  parallel: true,
  maxConcurrency: 4,
  nodeTimeout: 600000,    // 10 minutes per node
  globalTimeout: 3600000, // 1 hour total
  continueOnError: false,
  verbose: true,
});

// Set up callbacks
engine.setUpdateNodeData((nodeId, updates) => {
  // Update your React Flow nodes
});

engine.setProgressCallback((event, data) => {
  console.log(`[${event}]`, data.message);
});

// Execute
const result = await engine.execute(nodes, edges);

if (result.success) {
  console.log('Completed:', result.stats);
  console.log('Outputs:', result.outputs);
} else {
  console.error('Failed:', result.error);
}
```

## Dependency Graph Operations

```typescript
import {
  buildDependencyGraph,
  detectCircularDependency,
  topologicalSort,
  createExecutionBatches,
  getCriticalPath,
} from '@/engine';

// Build dependency graph
const graph = buildDependencyGraph(nodes, edges);

// Detect cycles
const cycle = detectCircularDependency(graph);
if (cycle) {
  console.error('Circular dependency:', cycle.join(' -> '));
}

// Get execution order
const order = topologicalSort(nodes, edges);

// Get parallel execution batches
const batches = createExecutionBatches(graph);
batches.forEach((batch) => {
  console.log(`Batch ${batch.index}: ${batch.nodeIds.join(', ')}`);
});

// Find critical path (longest dependency chain)
const criticalPath = getCriticalPath(graph);
console.log('Critical path:', criticalPath);
```

## Creating Custom Executors

```typescript
import { registerExecutor, type NodeExecutor } from '@/engine';

const myCustomExecutor: NodeExecutor = async (node, context) => {
  const { updateNodeState, getInputs, isCancelled, log } = context;
  
  // Get resolved inputs from connected nodes
  const inputs = getInputs(node.id);
  const image = inputs['image-in'];
  const prompt = inputs['prompt-in'] || node.data.localPrompt;
  
  // Update status
  updateNodeState(node.id, { 
    status: ExecutionStatus.RUNNING,
    message: 'Processing...',
    progress: 0,
  });
  
  // Check for cancellation
  if (isCancelled()) {
    throw new Error('Execution cancelled');
  }
  
  // Perform work
  log('info', 'Starting custom processing', { nodeId: node.id });
  
  const result = await myApiCall({ image, prompt });
  
  // Update progress
  updateNodeState(node.id, { 
    progress: 50,
    message: 'Polling for results...',
  });
  
  // Poll for completion
  const finalResult = await pollForCompletion(result.taskId);
  
  return { 
    outputImage: finalResult.url,
    metadata: finalResult.metadata,
  };
};

// Register the executor
registerExecutor('myCustomNode', myCustomExecutor);
```

## Execution Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `parallel` | boolean | true | Enable parallel execution of independent nodes |
| `maxConcurrency` | number | 4 | Maximum concurrent node executions |
| `continueOnError` | boolean | false | Continue executing remaining nodes after a failure |
| `nodeTimeout` | number | 600000 | Timeout per node in milliseconds |
| `globalTimeout` | number | 3600000 | Global execution timeout in milliseconds |
| `verbose` | boolean | false | Enable detailed logging |

## Execution Status

```typescript
enum ExecutionStatus {
  IDLE = 'idle',           // Not started
  PENDING = 'pending',     // Waiting for dependencies
  RUNNING = 'running',     // Currently executing
  COMPLETED = 'completed', // Successfully finished
  FAILED = 'failed',       // Error occurred
  CANCELLED = 'cancelled', // User cancelled
  SKIPPED = 'skipped',     // No executor available
}
```

## API Reference

### ExecutionEngine

```typescript
class ExecutionEngine {
  setUpdateNodeData(fn: (nodeId: string, updates: Partial<NodeData>) => void): void;
  setProgressCallback(callback: ProgressCallback): void;
  execute(nodes: Node<NodeData>[], edges: Edge[]): Promise<EngineExecutionResult>;
  cancel(): void;
  getNodeState(nodeId: string): NodeExecutionState | undefined;
  getAllNodeStates(): Map<string, NodeExecutionState>;
  getNodeOutput(nodeId: string): unknown;
}
```

### useExecutionEngine Hook

```typescript
interface UseExecutionEngineReturn {
  isExecuting: boolean;
  currentPhase: string;
  currentBatch: number;
  totalBatches: number;
  progress: number;
  nodeStates: Map<string, NodeExecutionState>;
  completedNodes: string[];
  failedNodes: string[];
  error: string | null;
  execute: (nodes: Node<NodeData>[], edges: Edge[]) => Promise<EngineExecutionResult>;
  cancel: () => void;
  reset: () => void;
  isNodeExecuting: (nodeId: string) => boolean;
  isNodeCompleted: (nodeId: string) => boolean;
  isNodeFailed: (nodeId: string) => boolean;
  getNodeState: (nodeId: string) => NodeExecutionState | undefined;
  getExecutionLevels: (nodes: Node<NodeData>[], edges: Edge[]) => string[][];
}
```

## Built-in Executors

The following node types have built-in executors:

### Input Nodes
- `inputNode` - Passes through field values
- `textNode` - Returns text value
- `imageNode` - Returns image URLs
- `assetNode` - Returns asset images

### Vision Nodes
- `imageAnalyzer` - Analyzes images with Claude Vision
- `imageToPrompt` - Generates prompts from images
- `improvePrompt` - Enhances prompts with AI
- `aiImageClassifier` - Classifies images

### Image Generation
- `generator` - Nano Banana 2 / Kora image generation

### Image Editing
- `creativeUpscale` - Creative upscaling
- `precisionUpscale` - Precision upscaling
- `removeBackground` - Background removal

### Utility Nodes
- `responseNode` - Collects and displays outputs
- `comment` - No-op (documentation only)
- `router` - Passes through input

## File Structure

```
engine/
├── index.ts              # Main exports
├── types.ts              # TypeScript types
├── dependencyGraph.ts    # Graph building & analysis
├── executors.ts          # Node executors registry
├── executionEngine.ts    # Core engine
└── README.md             # This file
```
