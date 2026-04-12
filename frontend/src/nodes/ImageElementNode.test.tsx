import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import { ReactFlowProvider } from '@xyflow/react';
import ImageElementNode from './ImageElementNode';

describe('ImageElementNode', () => {
  const defaultProps = {
    id: 'test-id',
    data: {
      label: 'Test Image',
      imageUrl: 'data:image/png;base64,fake-data',
    },
    selected: false,
    zIndex: 1,
    isConnectable: true,
  };

  const renderWithReactFlow = (ui: React.ReactElement) => {
    return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
  };

  it('renders the image element with correct label', () => {
    renderWithReactFlow(<ImageElementNode {...defaultProps as any} />);
    expect(screen.getByText('Test Image')).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'data:image/png;base64,fake-data');
  });

  it('shows "No Image" when imageUrl is missing', () => {
    const props = { ...defaultProps, data: { ...defaultProps.data, imageUrl: null } };
    renderWithReactFlow(<ImageElementNode {...props as any} />);
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('dispatches send-to-chat event when clicking send button', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    renderWithReactFlow(<ImageElementNode {...defaultProps as any} />);
    
    // Find the button inside the hidden hover group (it's in the DOM though)
    const button = screen.getByTitle('Send to Chat');
    fireEvent.click(button);
    
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe('send-to-chat');
    expect(event.detail.images).toContain('data:image/png;base64,fake-data');
  });
});
