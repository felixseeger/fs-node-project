import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ReactFlowProvider } from '@xyflow/react';
import RelightNode from './RelightNode';
import React from 'react';

// Mock the shared hooks and components if needed, or rely on real ones if they are simple enough
vi.mock('./shared', async () => {
  const actual = await vi.importActual('./shared');
  return {
    ...actual,
    useNodeConnections: () => ({
      onDisconnectNode: vi.fn(),
      update: vi.fn(),
      conn: () => ({ connected: false, info: null }),
      resolve: {
        image: () => [],
        text: () => '',
      }
    }),
  };
});

vi.mock('../hooks/useNodeProgress', () => ({
  default: () => ({
    isActive: false,
    start: vi.fn(),
    complete: vi.fn(),
    fail: vi.fn(),
  }),
}));

describe('RelightNode', () => {
  const defaultProps = {
    id: 'test-relight-id',
    data: {
      label: 'Relight Test',
    },
    selected: false,
  };

  const renderWithReactFlow = (ui) => {
    return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
  };

  it('renders correctly', () => {
    renderWithReactFlow(<RelightNode {...defaultProps} />);
    expect(screen.getByText('Relight Test')).toBeInTheDocument();
    expect(screen.getByText('Light Transfer')).toBeInTheDocument();
    expect(screen.getAllByText('Prompt').length).toBeGreaterThan(0);
    expect(screen.getByText('Reference')).toBeInTheDocument();
    expect(screen.getByText('Lightmap')).toBeInTheDocument();
  });

  it('renders output handles including image_urls', () => {
    const { container } = renderWithReactFlow(<RelightNode {...defaultProps} />);
    // Check for handles by their IDs if they are rendered in the DOM
    const imageUrlsHandle = container.querySelector('[data-handleid="image_urls"]');
    expect(imageUrlsHandle).toBeTruthy();
  });
});
