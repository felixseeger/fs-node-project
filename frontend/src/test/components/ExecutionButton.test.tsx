/**
 * Example Component Test
 * Tests a hypothetical ExecutionButton component
 */

import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../utils';
import React, { useState } from 'react';
import { useExecutionEngine } from '@/hooks';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '@/types';

// Mock the API
vi.mock('@/utils/api', () => ({
  generateImage: vi.fn().mockResolvedValue({ data: { id: 'task-1' } }),
  pollStatus: vi.fn().mockResolvedValue({
    data: {
      status: 'COMPLETED',
      output: 'https://example.com/generated.png',
    },
  }),
}));

// Simple ExecutionButton component for testing
interface ExecutionButtonProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

function ExecutionButton({ nodes, edges }: ExecutionButtonProps) {
  const [results, setResults] = useState<string[]>([]);
  
  const {
    isExecuting,
    progress,
    execute,
    completedNodes,
  } = useExecutionEngine({
    onComplete: (result) => {
      setResults((prev) => [
        ...prev,
        `Completed: ${result.stats.completedNodes} nodes`,
      ]);
    },
  });

  const handleExecute = async () => {
    await execute(nodes, edges);
  };

  return (
    <div>
      <button
        onClick={handleExecute}
        disabled={isExecuting}
        data-testid="execute-button"
      >
        {isExecuting ? `Executing... ${progress}%` : 'Execute Workflow'}
      </button>
      
      {isExecuting && (
        <div data-testid="progress-bar">
          <div
            style={{ width: `${progress}%` }}
            data-testid="progress-fill"
          />
        </div>
      )}
      
      <div data-testid="completed-count">
        Completed: {completedNodes.length}
      </div>
      
      <ul data-testid="results">
        {results.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

describe('ExecutionButton', () => {
  const mockNodes: Node<NodeData>[] = [
    {
      id: 'node-1',
      type: 'responseNode',
      position: { x: 0, y: 0 },
      data: { label: 'Response' },
    },
  ];

  const mockEdges: Edge[] = [];

  it('should render execute button', () => {
    render(<ExecutionButton nodes={mockNodes} edges={mockEdges} />);
    
    const button = screen.getByTestId('execute-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Execute Workflow');
  });

  it('should execute workflow on click', async () => {
    render(<ExecutionButton nodes={mockNodes} edges={mockEdges} />);
    
    const button = screen.getByTestId('execute-button');
    
    fireEvent.click(button);
    
    // Should show executing state
    await waitFor(() => {
      expect(button).toBeDisabled();
    });
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.getByTestId('completed-count')).toHaveTextContent('Completed: 1');
    }, { timeout: 5000 });
  });

  it('should display progress during execution', async () => {
    render(<ExecutionButton nodes={mockNodes} edges={mockEdges} />);
    
    const button = screen.getByTestId('execute-button');
    fireEvent.click(button);
    
    // Progress bar should appear
    await waitFor(() => {
      const progressBar = screen.queryByTestId('progress-bar');
      expect(progressBar).toBeInTheDocument();
    });
  });

  it('should show results after completion', async () => {
    render(<ExecutionButton nodes={mockNodes} edges={mockEdges} />);
    
    const button = screen.getByTestId('execute-button');
    fireEvent.click(button);
    
    // Wait for result to appear
    await waitFor(() => {
      const results = screen.getByTestId('results');
      expect(results.children.length).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });
});
