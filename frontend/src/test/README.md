# Testing Environment

Comprehensive testing setup for the AI Pipeline Editor frontend.

## Stack

- **Vitest**: Fast Vite-native test runner
- **React Testing Library**: Component testing utilities
- **jsdom**: Browser environment simulation
- **@testing-library/jest-dom**: Custom DOM matchers

## Directory Structure

```
src/test/
├── setup.ts              # Test environment setup
├── utils.tsx             # Test utilities & factories
├── README.md             # This file
└── components/           # Component test examples

src/engine/__tests__/     # Engine unit tests
├── dependencyGraph.test.ts
└── executionEngine.test.ts

src/hooks/__tests__/      # Hook tests
└── useExecutionEngine.test.tsx
```

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run with coverage report
npm run test:coverage

# Run specific test suites
npm run test:engine    # Engine tests only
npm run test:hooks     # Hook tests only
```

## Test Utilities

### Node Factories

```typescript
import { createNode, createInputNode, createGeneratorNode } from '@/test/utils';

// Create generic node
const node = createNode('generator', {
  id: 'my-node',
  data: { label: 'Custom' },
});

// Create specific node types
const input = createInputNode({ id: 'input-1' });
const generator = createGeneratorNode({ id: 'gen-1' });
```

### Edge Factories

```typescript
import { createEdge, createPromptEdge, createImageEdge } from '@/test/utils';

// Create connection
const edge = createEdge('source-id', 'target-id');

// Create typed connections
const promptEdge = createPromptEdge('input-1', 'generator-1');
const imageEdge = createImageEdge('input-1', 'generator-1');
```

### Workflow Builders

```typescript
import {
  buildLinearWorkflow,
  buildBranchingWorkflow,
  buildCircularWorkflow,
  buildComplexWorkflow,
} from '@/test/utils';

// Simple chain: input -> processor -> output
const { nodes, edges } = buildLinearWorkflow();

// Branching: one input -> two parallel processors
const { nodes, edges } = buildBranchingWorkflow();

// For testing cycle detection
const { nodes, edges } = buildCircularWorkflow();

// Multi-level complex workflow
const { nodes, edges } = buildComplexWorkflow();
```

### Async Utilities

```typescript
import { wait, flushPromises, waitForAssertion } from '@/test/utils';

// Wait for duration
await wait(100);

// Flush pending promises
await flushPromises();

// Wait for assertion to pass
await waitForAssertion(() => {
  expect(result.current.isExecuting).toBe(false);
});
```

### API Mocking

```typescript
import { mockApi, createApiMock } from '@/test/utils';

// Mock entire API module
const mocks = mockApi();

// Access individual mocks
expect(mocks.generateImage).toHaveBeenCalled();
expect(mocks.pollStatus).toHaveBeenCalledWith('task-1');
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { topologicalSort } from '@/engine/dependencyGraph';
import { buildLinearWorkflow } from '@/test/utils';

describe('topologicalSort', () => {
  it('should sort nodes in dependency order', () => {
    const { nodes, edges } = buildLinearWorkflow();
    const sorted = topologicalSort(nodes, edges);
    
    expect(sorted.indexOf('input-1')).toBeLessThan(
      sorted.indexOf('processor-1')
    );
  });
});
```

### Hook Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExecutionEngine } from '@/hooks';
import { buildLinearWorkflow } from '@/test/utils';

describe('useExecutionEngine', () => {
  it('should execute workflow', async () => {
    const { nodes, edges } = buildLinearWorkflow();
    const { result } = renderHook(() => useExecutionEngine());
    
    await act(async () => {
      await result.current.execute(nodes, edges);
    });
    
    expect(result.current.progress).toBe(100);
  });
});
```

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render and interact', async () => {
    render(<MyComponent />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

## Matchers

Available custom matchers from `@testing-library/jest-dom`:

```typescript
// DOM presence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibility
expect(element).toBeVisible();

// Content
expect(element).toHaveTextContent('Hello');
expect(element).toHaveTextContent(/hello/i);

// Attributes
expect(element).toHaveAttribute('disabled');
expect(element).toHaveAttribute('href', '/link');
expect(input).toHaveValue('test');

// Classes
expect(element).toHaveClass('active');
expect(element).toHaveClass('btn', 'btn-primary');

// Form state
expect(button).toBeDisabled();
expect(button).toBeEnabled();
expect(checkbox).toBeChecked();
expect(input).toHaveFocus();
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// Good: Tests what user sees
expect(screen.getByText('Execution Complete')).toBeInTheDocument();

// Bad: Tests internal state
expect(component.internalState.isDone).toBe(true);
```

### 2. Use Test IDs Sparingly

```typescript
// Prefer queries that reflect user interaction
screen.getByRole('button', { name: /execute/i });
screen.getByLabelText('Prompt');

// Use test IDs only when necessary
screen.getByTestId('execution-progress');
```

### 3. Mock External Dependencies

```typescript
vi.mock('@/utils/api', () => ({
  generateImage: vi.fn().mockResolvedValue({ data: { id: 'task-1' } }),
}));
```

### 4. Clean Up After Tests

```typescript
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

### 5. Test Error Cases

```typescript
it('should handle errors gracefully', async () => {
  vi.mocked(api.generateImage).mockRejectedValue(new Error('API Error'));
  
  const { result } = renderHook(() => useExecutionEngine());
  
  await act(async () => {
    await result.current.execute(nodes, edges);
  });
  
  expect(result.current.error).toContain('API Error');
});
```

## Coverage

Coverage reports are generated in multiple formats:
- Terminal: `npm run test:coverage`
- HTML: Open `coverage/index.html`
- JSON: `coverage/coverage-final.json`

Excluded from coverage:
- Test files
- Type definitions
- Configuration files

## Troubleshooting

### Tests Timing Out

Increase timeout for async operations:
```typescript
it('slow test', { timeout: 10000 }, async () => {
  // ...
});
```

### React Warnings

Common warnings are filtered in `setup.ts`. Add custom filters if needed:
```typescript
console.error = (...args) => {
  if (args[0]?.includes('Your warning')) return;
  originalConsoleError.apply(console, args);
};
```

### Mock Not Working

Ensure mock is at module level and hoisted:
```typescript
// At top of file
vi.mock('@/utils/api', () => ({
  // mock implementation
}));
```
