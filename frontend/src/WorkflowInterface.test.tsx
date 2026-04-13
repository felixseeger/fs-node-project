import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { WorkflowInterface } from './WorkflowInterface';
import React from 'react';

describe('WorkflowInterface', () => {
  const defaultProps = {
    nodes: [
      {
        id: 'node-1',
        type: 'InputNode',
        data: {
          label: 'User Input',
          publishedPoints: ['prompt', 'image_urls'],
          prompt: 'A sunny day',
        },
      },
      {
        id: 'node-2',
        type: 'OutputNode',
        data: {
          label: 'Final Result',
          publishedPoints: ['output-image'],
          'output-image': 'data:image/png;base64,result',
        },
      }
    ],
    edges: [],
    onUpdateNodeData: vi.fn(),
    onRunWorkflow: vi.fn(),
    onSwitchToEditor: vi.fn(),
    isRunning: false,
  };

  it('renders input and output points correctly', () => {
    render(<WorkflowInterface {...defaultProps as any} />);
    
    // Check titles
    expect(screen.getByText('INPUTS')).toBeInTheDocument();
    expect(screen.getByText('OUTPUTS')).toBeInTheDocument();
    
    // Check input point label (appears once per point)
    const inputLabels = screen.getAllByText('User Input');
    expect(inputLabels.length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue('A sunny day')).toBeInTheDocument();
    
    // Check output point
    expect(screen.getByText('Final Result')).toBeInTheDocument();
    // Use getAllByRole with a more specific query or check text
    expect(screen.getByText('output-image')).toBeInTheDocument();
  });

  it('shows empty state when no points are published', () => {
    render(<WorkflowInterface {...defaultProps as any} nodes={[]} />);
    expect(screen.getByText('No API points published')).toBeInTheDocument();
  });
});
