import { vi } from "vitest";
/**
 * VibeCodingChat Component Tests
 * Comprehensive test suite for AI chat interface and workflow generation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VibeCodingChat from '../../components/VibeCodingChat';
import { useStore } from '../../store';
import { generateWorkflowFromPrompt } from '../aiWorkflowGenerator';

vi.mock('blue-ether', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Avatar: () => <div data-testid="mock-avatar" />
  };
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.Element.prototype.scrollIntoView = vi.fn();

// Mock the store
vi.mock('../../store', () => ({
  useStore: vi.fn(() => ({
    addNodes: vi.fn(),
    addEdges: vi.fn(),
    setWorkflow: vi.fn()
  }))
}));

// Mock the AI workflow generator
vi.mock('../aiWorkflowGenerator', () => ({
  generateWorkflowFromPrompt: vi.fn()
}));

describe('VibeCodingChat Component', () => {
  const mockOnClose = vi.fn();

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.Element.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders chat interface when open', () => {
    render(<VibeCodingChat isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('🤖 Vibe Coding Assistant')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe your workflow...')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    const { container } = render(<VibeCodingChat isOpen={false} onClose={mockOnClose} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('shows welcome message on initial render', () => {
    render(<VibeCodingChat isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText(/Hello! I'm your AI workflow assistant/i)).toBeInTheDocument();
  });

  test('allows user to input workflow description', () => {
    render(<VibeCodingChat isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText('Describe your workflow...');
    fireEvent.change(input, { target: { value: 'Create a surreal landscape' } });
    
    expect(input).toHaveValue('Create a surreal landscape');
  });

  test('shows suggestion buttons', () => {
    render(<VibeCodingChat isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Create a surrea...')).toBeInTheDocument();
    expect(screen.getByText('Generate a cybe...')).toBeInTheDocument();
    expect(screen.getByText('Design a fantas...')).toBeInTheDocument();
  });

  test('handles suggestion clicks', () => {
    render(<VibeCodingChat isOpen={true} onClose={mockOnClose} />);
    
    const suggestionButton = screen.getByText('Create a surrea...');
    fireEvent.click(suggestionButton);
    
    const input = screen.getByPlaceholderText('Describe your workflow...');
    expect(input).toHaveValue('Create a surreal landscape with vibrant colors');
  });

  test('handles form submission', async () => {
    // Mock successful workflow generation
    generateWorkflowFromPrompt.mockResolvedValue({
      nodes: [{ id: 'generated1', type: 'generator' }],
      edges: []
    });

    render(<VibeCodingChat isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText('Describe your workflow...');
    const generateButton = screen.getByText('Go');
    
    fireEvent.change(input, { target: { value: 'Test workflow' } });
    fireEvent.click(generateButton);

    // Check that generating state is shown
    expect(screen.getByText('Generating your workflow...')).toBeInTheDocument();
    expect(generateButton).toBeDisabled();

    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByText(/✨ Workflow generated!/i)).toBeInTheDocument();
    });
  });

  test('handles workflow generation errors', async () => {
    // Mock failed workflow generation
    generateWorkflowFromPrompt.mockRejectedValue(new Error('Generation failed'));

    render(<VibeCodingChat isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText('Describe your workflow...');
    const generateButton = screen.getByText('Go');
    
    fireEvent.change(input, { target: { value: 'Invalid request' } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText('Failed to generate workflow. Please try again.')).toBeInTheDocument();
    });
  });

  test('disables generate button when input is empty', () => {
    render(<VibeCodingChat isOpen={true} onClose={mockOnClose} />);
    
    const generateButton = screen.getByText('Go');
    expect(generateButton).toBeDisabled();
  });

  test('calls onClose when close button is clicked', () => {
    render(<VibeCodingChat isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close chat');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('shows error messages when generation fails', async () => {
    generateWorkflowFromPrompt.mockRejectedValue(new Error('Network error'));

    render(<VibeCodingChat isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText('Describe your workflow...');
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Go'));

    await waitFor(() => {
      expect(screen.getByText('Failed to generate workflow. Please try again.')).toBeInTheDocument();
    });
  });
});

// Additional tests that would be valuable:
// - Test message scrolling behavior
// - Test clear chat functionality
// - Test accessibility features (keyboard navigation, screen reader support)
// - Test different workflow types (image, video, audio, complex)
// - Test edge cases and input validation