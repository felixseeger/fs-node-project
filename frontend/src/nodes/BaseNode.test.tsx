import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import BaseNode from './BaseNode';

vi.mock('./NodeGenerateButton', () => ({
  default: () => <span data-testid="node-generate-button">gen</span>,
}));

vi.mock('./NodeDownloadButton', () => ({
  default: () => <span data-testid="node-download-button">dl</span>,
}));

describe('BaseNode', () => {
  it('sets data-node-id from id', () => {
    const { container } = render(
      <BaseNode id="node-abc" label="My node">
        <p>content</p>
      </BaseNode>
    );
    const root = container.querySelector('[data-node-id="node-abc"]');
    expect(root).toBeTruthy();
    expect(screen.getByText('My node')).toBeInTheDocument();
  });

  it('renders disconnect control and calls onDisconnect', () => {
    const onDisconnect = vi.fn();
    render(
      <BaseNode id="n1" label="L" onDisconnect={onDisconnect}>
        body
      </BaseNode>
    );
    const btn = screen.getByRole('button', { name: /disconnect all connections/i });
    fireEvent.click(btn);
    expect(onDisconnect).toHaveBeenCalledTimes(1);
  });

  it('omits disconnect when onDisconnect is not provided', () => {
    render(
      <BaseNode id="n2" label="L">
        body
      </BaseNode>
    );
    expect(
      screen.queryByRole('button', { name: /disconnect all connections/i })
    ).toBeNull();
  });

  it('calls onEdit from header edit button', () => {
    const onEdit = vi.fn();
    render(
      <BaseNode id="n3" label="L" onEdit={onEdit}>
        body
      </BaseNode>
    );
    fireEvent.click(screen.getByRole('button', { name: /edit node/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
