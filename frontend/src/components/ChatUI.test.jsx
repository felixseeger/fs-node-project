import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/utils';
import ChatUI from './ChatUI';

// Mock DecodedText to avoid animation issues in tests
vi.mock('./DecodedText', () => ({
  default: ({ text }) => <span>{text}</span>
}));

vi.mock('blue-ether', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Avatar: () => <div data-testid="mock-avatar" />
  };
});

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
    expect(screen.getByText(/Welcome to the AI Workflow Builder/i)).toBeInTheDocument();
  });

  it('calls onClose when close is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ChatUI isOpen onClose={onClose} onSendMessage={vi.fn()} onGenerate={vi.fn()} />
    );
    await user.click(screen.getByLabelText(/Close chat/i));
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
        tags={[]}
      />
    );
    const input = screen.getByLabelText(/Chat input message/i);
    await user.type(input, 'Hello pipeline');
    await user.click(screen.getByTestId('chat-generate'));
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
        tags={[]}
      />
    );
    await user.type(screen.getByLabelText(/Chat input message/i), '  image upscale chain  ');
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
