import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/utils';
import ChatUI from './ChatUI';

describe('ChatUI', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ChatUI isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows assistant greeting when open', () => {
    render(
      <ChatUI
        isOpen
        onClose={vi.fn()}
        onSendMessage={vi.fn()}
        onGenerate={vi.fn()}
      />
    );
    expect(screen.getByTestId('chat-ui')).toBeInTheDocument();
    expect(screen.getByText(/I'm here to help you build your AI workflow/i)).toBeInTheDocument();
  });

  it('calls onClose when close is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ChatUI isOpen onClose={onClose} onSendMessage={vi.fn()} onGenerate={vi.fn()} />
    );
    await user.click(screen.getByTestId('chat-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSendMessage when sending a message', async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn();
    render(
      <ChatUI
        isOpen
        onClose={vi.fn()}
        onSendMessage={onSendMessage}
        onGenerate={vi.fn()}
      />
    );
    const input = screen.getByTestId('chat-input');
    await user.type(input, 'Hello pipeline');
    await user.click(screen.getByTestId('chat-send'));
    expect(onSendMessage).toHaveBeenCalledWith('Hello pipeline');
  });

  it('calls onGenerate with trimmed input when Generate workflow is clicked', async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn();
    render(
      <ChatUI
        isOpen
        onClose={vi.fn()}
        onSendMessage={vi.fn()}
        onGenerate={onGenerate}
      />
    );
    await user.type(screen.getByTestId('chat-input'), '  image upscale chain  ');
    await user.click(screen.getByTestId('chat-generate'));
    await waitFor(() => {
      expect(onGenerate).toHaveBeenCalledWith('image upscale chain');
    });
  });

  it('disables generate while isGenerating', () => {
    render(
      <ChatUI
        isOpen
        onClose={vi.fn()}
        onSendMessage={vi.fn()}
        onGenerate={vi.fn()}
        isGenerating
      />
    );
    expect(screen.getByTestId('chat-generate')).toBeDisabled();
  });

  it('adds an assistant message via addMessage ref method', () => {
    const chatRef = { current: null };
    render(
      <ChatUI
        ref={chatRef}
        isOpen
        onClose={vi.fn()}
      />
    );

    act(() => {
      chatRef.current.addMessage({ content: 'AI Response' });
    });
    expect(screen.getByText('AI Response')).toBeInTheDocument();
  });
});
