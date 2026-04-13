import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import { ReactFlowProvider } from '@xyflow/react';
import SimplifiedGeneratorNode from './SimplifiedGeneratorNode';
import React from 'react';

describe('SimplifiedGeneratorNode', () => {
  const defaultProps = {
    id: 'test-gen-id',
    data: {
      label: 'Nano Banana 2 Pro',
      inputPrompt: 'A futuristic city',
      outputImage: 'data:image/png;base64,fake-gen-data',
    },
    selected: false,
    zIndex: 1,
    isConnectable: true,
  };

  const renderWithReactFlow = (ui: React.ReactElement) => {
    return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
  };

  it('renders correctly with title and prompt', () => {
    renderWithReactFlow(<SimplifiedGeneratorNode {...defaultProps as any} />);
    expect(screen.getByText('Nano Banana 2 Pro')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A futuristic city')).toBeInTheDocument();
  });

  it('displays the generated image preview', () => {
    renderWithReactFlow(<SimplifiedGeneratorNode {...defaultProps as any} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'data:image/png;base64,fake-gen-data');
  });

  it('shows the download button when an image is present', () => {
    renderWithReactFlow(<SimplifiedGeneratorNode {...defaultProps as any} selected={true} />);
    // The UniversalSimplifiedNodeChrome shows action buttons on hover or selection
    expect(screen.getByTitle('Download')).toBeInTheDocument();
  });
});
