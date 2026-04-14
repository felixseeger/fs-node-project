# Code Splitting & Dynamic Nodes - Migration Guide (Phase 7.2.1)

## Overview
As of Phase 7.2.1, all 50+ node components in the FS Node Project are loaded asynchronously using `React.lazy()`. This reduces the initial bundle size and improves Time-To-Interactive (TTI).

If you are adding a new AI Node or utility to the canvas, **do not import it directly into `frontend/src/config/flowTypes.ts`**. You must follow the dynamic loading pattern below.

## How to Add a New Node

### 1. Create the Component
Create your new node component inside `frontend/src/nodes/` (e.g., `MyNewNode.tsx`). Ensure it uses `default export`:

```typescript
export default function MyNewNode({ id, data, selected }: any) {
  // Your node logic here...
}
```

### 2. Register the Node in `nodeRegistry.ts`
Open `frontend/src/nodes/nodeRegistry.ts` and add your new node to the `nodeRegistry` object using `lazy()`:

```typescript
// frontend/src/nodes/nodeRegistry.ts
import React, { lazy } from 'react';

const nodeRegistry: Record<string, React.LazyExoticComponent<any>> = {
  // ... existing nodes
  MyNewNode: lazy(() => import('./MyNewNode')), // Add your new node here
};
```

### 3. Add to the React Flow Config
Open `frontend/src/config/flowTypes.ts` and map your custom node string to the registry using the `createDynamicNodeWrapper` and `getNodeComponent` utilities:

```typescript
// frontend/src/config/flowTypes.ts
import { getNodeComponent } from '../nodes/nodeRegistry';

export const initialNodeTypes: NodeTypes = {
  // ... existing mappings
  myNewNode: createDynamicNodeWrapper(getNodeComponent('MyNewNode')),
};
```

### 4. (Optional) Prefetch the Node
If your node is commonly used (e.g., a core input/output node), you may want to prefetch its code chunk to avoid a loading skeleton appearing when the user selects it from the menu. Add it to `frontend/src/nodes/prefetch.ts`:

```typescript
// frontend/src/nodes/prefetch.ts
export const prefetchCommonNodes = () => {
  // ... existing
  import('./MyNewNode').catch(console.warn);
};
```

## How It Works Internally
- `nodeRegistry.ts` resolves a string (e.g. `'MyNewNode'`) to a `React.lazy()` component.
- `createDynamicNodeWrapper` wraps the `lazy` component in a `React.Suspense` block and a `NodeErrorBoundary`.
- While the chunk is downloading from the server, the `NodeLoadingSkeleton` is displayed to preserve layout structure.
- If the network fails to download the chunk, the `NodeErrorBoundary` renders a localized "Retry" button rather than crashing the React Flow canvas.
