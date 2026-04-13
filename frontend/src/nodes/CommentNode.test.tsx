import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ReactFlowProvider } from '@xyflow/react';
import CommentNode from './CommentNode';
import React from 'react';

describe('CommentNode', () => {
  const defaultProps = {
    id: 'test-comment-id',
    data: {
      text: 'Sample comment text',
    },
    selected: false,
    zIndex: 1,
    isConnectable: true,
  };

  const renderWithReactFlow = (ui: React.ReactElement) => {
    return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
  };

  it('renders correctly with text', () => {
    renderWithReactFlow(<CommentNode {...defaultProps as any} />);
    expect(screen.getByText('Sample comment text')).toBeInTheDocument();
  });

  it('shows placeholder when empty', () => {
    const emptyProps = { ...defaultProps, data: { text: '' } };
    renderWithReactFlow(<CommentNode {...emptyProps as any} />);
    // When text is empty, isEditing defaults to true
    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
  });
});
