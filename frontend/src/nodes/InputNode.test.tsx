import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ReactFlowProvider } from '@xyflow/react';
import InputNode from './InputNode';
import React from 'react';

describe('InputNode', () => {
  const defaultProps = {
    id: 'test-input-id',
    data: {
      label: 'Request - Inputs',
      initialFields: ['prompt', 'text'],
      fieldValues: {
        prompt: 'Initial prompt',
        text: 'Initial text'
      }
    },
    selected: false,
    zIndex: 1,
    isConnectable: true,
  };

  const renderWithReactFlow = (ui: React.ReactElement) => {
    return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
  };

  it('renders correctly with initial fields and labels', () => {
    renderWithReactFlow(<InputNode {...defaultProps as any} />);
    expect(screen.getByText('Request - Inputs')).toBeInTheDocument();
    expect(screen.getByText('Prompt')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('displays initial field values in textareas', () => {
    renderWithReactFlow(<InputNode {...defaultProps as any} />);
    expect(screen.getByDisplayValue('Initial prompt')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial text')).toBeInTheDocument();
  });
});
