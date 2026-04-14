# Phase 7.2.1: Code Splitting Implementation Plan - COMPLETED ✅

## Overview
**Objective:** Implement React.lazy() for all 50+ node components to achieve 40% bundle size reduction
**Timeline:** 1 week (5 business days)
**Target Impact:** Reduce main bundle from 2.07MB to ~1.2MB

## Current State

### Bundle Analysis
- **Main Bundle:** 2,067.60 kB (507.97 kB gzipped)
- **Node Components:** ~800KB (38% of bundle)
- **All 50+ nodes:** Loaded synchronously on initial load

### Performance Issues
- Slow initial load time (~1-2 seconds)
- Large bundle size triggers Vite warnings
- All nodes loaded even if not used

## Implementation Strategy

## Day 1: Preparation & Research

### Tasks
```
[x] Review current node import structure
[x] Analyze node usage patterns (which nodes are most common)
[x] Research React.lazy() best practices
[x] Set up error boundaries for async loading
[x] Create loading skeleton components
```

### Deliverables
- Node usage frequency analysis
- Loading skeleton designs
- Error boundary implementation plan

## Day 2: Pilot Implementation

### Tasks
```
[x] Select 5 most-used nodes for pilot (Input, Text, Image, Generator, Response)
[x] Convert to dynamic imports using React.lazy() (via nodeRegistry.ts)
[x] Implement loading states (NodeLoadingSkeleton)
[x] Add error boundaries (NodeErrorBoundary)
[x] Test pilot implementation (Build succeeded, chunks separated!)
```

### Example Code
```jsx
// Before: Synchronous import
import GeneratorNode from './nodes/GeneratorNode';

// After: Dynamic import
const GeneratorNode = React.lazy(() => import('./nodes/GeneratorNode'));

// Usage with Suspense
function NodeRenderer({ nodeType }) {
  const NodeComponent = nodeComponents[nodeType];
  return (
    <React.Suspense fallback={<NodeLoadingSkeleton />}>
      <NodeComponent />
    </React.Suspense>
  );
}
```

### Deliverables
- 5 nodes converted to dynamic imports
- Loading skeleton implementation
- Error boundary implementation
- Pilot test results

## Day 3: Full Implementation

### Tasks
```
[x] Convert remaining 45+ nodes to dynamic imports
[x] Update node registration system
[x] Handle circular dependencies
[x] Optimize bundle splitting
[x] Test all node types
```

### Implementation Pattern
```javascript
// nodes/index.js - Dynamic node registry
const nodeComponents = {
  GeneratorNode: React.lazy(() => import('./GeneratorNode')),
  FluxNode: React.lazy(() => import('./FluxNode')),
  // ... all 50+ nodes
};

export const getNodeComponent = (type) => nodeComponents[type];
```

### Deliverables
- All 50+ nodes converted
- Updated node registry
- Comprehensive test coverage

## Day 4: Performance Testing

### Tasks
```
[x] Run production build with new structure
[x] Compare bundle sizes (before/after)
[x] Test load times with different node combinations
[x] Measure time-to-interactive improvements
[x] Identify any performance regressions
```

### Test Scenarios
1. **Empty canvas:** No nodes loaded
2. **Single node:** One node type
3. **Common workflow:** 5-10 nodes
4. **Complex workflow:** 20+ nodes
5. **All nodes:** Stress test

### Deliverables
- Performance benchmark results
- Bundle size comparison
- Load time metrics
- Regression test report

## Day 5: Optimization & Documentation

### Tasks
```
[x] Optimize chunk naming for better caching
[x] Implement prefetching for likely nodes
[x] Add performance monitoring
[x] Update documentation
[x] Create migration guide
```

### Optimization Techniques
```javascript
// Prefetch likely nodes
useEffect(() => {
  const likelyNodes = ['GeneratorNode', 'InputNode', 'OutputNode'];
  likelyNodes.forEach(node => {
    import(`./nodes/${node}`);
  });
}, []);

// Dynamic chunk names
const GeneratorNode = React.lazy(() => 
  import(/* webpackChunkName: "generator-node" */ './GeneratorNode')
);
```

### Deliverables
- Optimized chunk configuration
- Prefetching implementation
- Updated documentation
- Migration guide for developers

## Technical Implementation

### Node Registry Pattern
```javascript
// nodes/nodeRegistry.js
import React from 'react';

const nodeRegistry = {
  // Image Generation
  GeneratorNode: React.lazy(() => import('./GeneratorNode')),
  FluxReimagineNode: React.lazy(() => import('./FluxReimagineNode')),
  TextToIconNode: React.lazy(() => import('./TextToIconNode')),
  
  // Image Editing
  CreativeUpScaleNode: React.lazy(() => import('./CreativeUpScaleNode')),
  PrecisionUpScaleNode: React.lazy(() => import('./PrecisionUpScaleNode')),
  // ... all 50+ nodes
};

export const getNodeComponent = (nodeType) => {
  const Component = nodeRegistry[nodeType];
  if (!Component) {
    console.warn(`Node type ${nodeType} not found`);
    return null;
  }
  return Component;
};

export const nodeTypes = Object.keys(nodeRegistry);
```

### Loading States
```jsx
// components/NodeLoadingSkeleton.jsx
export function NodeLoadingSkeleton() {
  return (
    <div className="node-skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-body" />
      <div className="skeleton-handle left" />
      <div className="skeleton-handle right" />
    </div>
  );
}
```

### Error Boundaries
```jsx
// components/NodeErrorBoundary.jsx
export class NodeErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Node loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="node-error">
          <p>Failed to load node</p>
          <button onClick={() => this.setState({ hasError: false })}
          >Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Usage in Canvas
```jsx
// components/NodeCanvas.jsx
function NodeRenderer({ nodeType, nodeData }) {
  const NodeComponent = getNodeComponent(nodeType);
  
  if (!NodeComponent) {
    return <NodeMissing type={nodeType} />;
  }

  return (
    <NodeErrorBoundary>
      <React.Suspense fallback={<NodeLoadingSkeleton />}>
        <NodeComponent {...nodeData} />
      </React.Suspense>
    </NodeErrorBoundary>
  );
}
```

## Success Metrics

### Target Improvements
```
Bundle Size: 2,067.60 kB → ~1,200 kB (42% reduction)
Node Load Time: Synchronous → On-demand
Memory Usage: All nodes → Active nodes only
Initial Load: ~1-2s → ~300-500ms (60% improvement)
```

### Measurement Tools
```bash
# Bundle analysis
npm run build -- --mode production

# Performance testing
lighthouse http://localhost:5173 --output=html

# Bundle visualization
npx rollup-plugin-visualizer
```

## Risk Mitigation

### Potential Risks
1. **Flash of Missing Content:** Nodes appear briefly during load
2. **Error Handling:** Failed node loads break workflows
3. **Performance Regression:** Poor chunking increases load time
4. **Circular Dependencies:** Complex import chains

### Mitigation Strategies
1. **Loading Skeletons:** Visual placeholders during load
2. **Error Boundaries:** Graceful fallback for failed loads
3. **Prefetching:** Load likely nodes in advance
4. **Chunk Optimization:** Smart chunk naming and grouping

## Fallback Plan

If code splitting causes issues:
```bash
# Revert to synchronous imports
git checkout HEAD -- frontend/src/nodes

# Alternative: Hybrid approach
# - Keep critical nodes synchronous
# - Make less-used nodes async
```

## Documentation Updates

### Files to Update
1. **README.md** - Add code splitting section
2. **CONTRIBUTING.md** - Node development guidelines
3. **ARCHITECTURE.md** - Dynamic loading architecture
4. **PERFORMANCE.md** - Optimization strategies

### New Documentation
```markdown
# Code Splitting Guide

## Adding New Nodes

```jsx
// 1. Create node component
// frontend/src/nodes/MyNewNode.jsx

// 2. Register in node registry
// frontend/src/nodes/nodeRegistry.js
MyNewNode: React.lazy(() => import('./MyNewNode')),

// 3. Add to node menu
// frontend/src/components/GooeyNodesMenu.jsx
```

## Best Practices

- **Chunk Size:** Keep chunks < 100KB for optimal loading
- **Naming:** Use descriptive chunk names for debugging
- **Prefetch:** Prefetch nodes likely to be used next
- **Fallback:** Always provide loading/error states
```

## Testing Strategy

### Unit Tests
```javascript
// __tests__/nodes.test.js
describe('Node Loading', () => {
  test('loads node dynamically', async () => {
    const NodeComponent = await import('../nodes/GeneratorNode');
    expect(NodeComponent).toBeDefined();
  });

  test('handles missing node', () => {
    const result = getNodeComponent('NonExistentNode');
    expect(result).toBeNull();
  });
});
```

### Integration Tests
```javascript
// __tests__/canvas.test.js
describe('Node Canvas', () => {
  test('renders node with suspense', () => {
    render(
      <React.Suspense fallback="loading">
        <NodeRenderer type="GeneratorNode" />
      </React.Suspense>
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
  });
});
```

### Performance Tests
```javascript
// __tests__/performance.test.js
describe('Performance', () => {
  test('bundle size under limit', async () => {
    const stats = await buildProject();
    expect(stats.mainBundleSize).toBeLessThan(1200 * 1024); // 1.2MB
  });

  test('initial load time', async () => {
    const metrics = await measureLoadTime();
    expect(metrics.loadTime).toBeLessThan(500); // 500ms
  });
});
```

## Rollout Plan

### Phase 1: Internal Testing
```
[ ] Implement code splitting
[ ] Test with development team
[ ] Fix any critical issues
[ ] Gather performance metrics
```

### Phase 2: Beta Release
```
[ ] Deploy to staging environment
[ ] Monitor real-world performance
[ ] Collect user feedback
[ ] Iterate on loading experience
```

### Phase 3: Production Release
```
[ ] Final performance testing
[ ] Update documentation
[ ] Deploy to production
[ ] Monitor metrics post-release
```

## Timeline

| Day | Focus | Deliverables |
|-----|-------|--------------|
| 1 | Preparation | Node analysis, loading skeletons |
| 2 | Pilot | 5 nodes converted, tested |
| 3 | Implementation | All 50+ nodes converted |
| 4 | Testing | Performance benchmarks |
| 5 | Optimization | Chunk naming, prefetching, docs |

## Next Steps

After completing Phase 7.2.1:
1. **Proceed to Phase 7.2.2:** Dependency optimization
2. **Measure impact:** Compare before/after metrics
3. **Iterate:** Refine based on real-world usage
4. **Document:** Update architecture diagrams

## Success Criteria

✅ **Bundle Size:** < 1,200KB (40%+ reduction)  
✅ **Load Time:** < 500ms (60%+ improvement)  
✅ **No Regressions:** All existing functionality works  
✅ **Documented:** Clear guidelines for future nodes  
✅ **Tested:** Comprehensive test coverage  

## Resources

- [React.lazy() Documentation](https://reactjs.org/docs/code-splitting.html#reactlazy)
- [Suspense Guide](https://reactjs.org/docs/concurrent-mode-suspense.html)
- [Vite Code Splitting](https://vitejs.dev/guide/features.html#dynamic-import)
- [Rollup Code Splitting](https://rollupjs.org/guide/en/#code-splitting)

## Appendix: Common Issues & Solutions

### Issue: Chunk Load Failure
**Solution:** Add error boundaries and retry logic

### Issue: Flash of Missing Content
**Solution:** Implement loading skeletons

### Issue: Large Initial Chunk
**Solution:** Ensure proper code splitting configuration

### Issue: Circular Dependencies
**Solution:** Restructure imports to avoid circles

### Issue: Slow Subsequent Loads
**Solution:** Implement proper caching headers
## Hardening Phase Completion (2026-04-11)

### API Security Hardening
- ✅ Implemented Helmet.js for secure headers
- ✅ Added request timeouts (120s) for AI operations
- ✅ Sanitized error responses to prevent internal leakage
- ✅ Tightened CORS policy and request size limits (10MB JSON)
- ✅ Implemented magic number file verification for uploads
- ✅ Added multi-layer rate limiting (Global, Generation, Polling)

### Frontend Type Hardening
- ✅ Standardized state to use `undefined` instead of `null` for optional values
- ✅ Fixed Connection -> Edge conversion type errors
- ✅ Implemented `isWorkflowImportData` type guard for JSON imports
- ✅ Fixed NodeTypes registry typing with generic wrapper
- ✅ Consolidated PageType and EditorMode literal unions
