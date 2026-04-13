import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ReactFlowProvider } from '@xyflow/react';
import TextNode from './TextNode';
import React from 'react';

describe('TextNode', () => {
  const defaultProps = {
    id: 'test-text-id',
    data: {
      label: 'Text Field',
      text: 'Hello world',
    },
    selected: false,
    zIndex: 1,
    isConnectable: true,
  };

  const renderWithReactFlow = (ui: React.ReactElement) => {
    return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
  };

  it('renders correctly with label and initial text', () => {
    renderWithReactFlow(<TextNode {...defaultProps as any} />);
    expect(screen.getByText('Text Field')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hello world')).toBeInTheDocument();
  });

  it('shows placeholder when text is missing', () => {
    const emptyProps = { ...defaultProps, data: { ...defaultProps.data, text: '' } };
    renderWithReactFlow(<TextNode {...emptyProps as any} />);
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });
});
