import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShareWorkflowModal } from './ShareWorkflowModal';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({
    empty: false,
    docs: [{ data: () => ({ email: 'test@example.com', displayName: 'Test User' }) }],
    forEach: (cb: any) => cb({ data: () => ({ email: 'test@example.com', displayName: 'Test User' }) })
  }))
}));

vi.mock('../../config/firebase', () => ({
  getDb: vi.fn(),
  isFirebaseConfigured: vi.fn(() => true)
}));

describe('ShareWorkflowModal', () => {
  const mockSetShareEmail = vi.fn();
  const mockSetShareModal = vi.fn();
  const mockOnShareWorkflow = vi.fn();
  const mockOnUnshareWorkflow = vi.fn();

  const defaultProps = {
    shareModal: { projectId: 'test-project', sharedWith: ['existing@example.com'] },
    shareEmail: '',
    setShareEmail: mockSetShareEmail,
    setShareModal: mockSetShareModal,
    onShareWorkflow: mockOnShareWorkflow,
    onUnshareWorkflow: mockOnUnshareWorkflow,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with existing shared users', async () => {
    render(<ShareWorkflowModal {...defaultProps} />);
    
    expect(screen.getByText('Share Workflow')).toBeDefined();
    expect(screen.getByPlaceholderText('Search or enter email address...')).toBeDefined();
    expect(screen.getByText('Shared with (1)')).toBeDefined();
    
    // Wait for profiles to load
    await waitFor(() => {
      expect(screen.getByText('existing@example.com')).toBeDefined();
    });
  });

  it('calls onShareWorkflow when a valid email is submitted', async () => {
    render(<ShareWorkflowModal {...defaultProps} shareEmail="new@example.com" />);
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.submit(shareButton.closest('form')!);
    
    await waitFor(() => {
      expect(mockOnShareWorkflow).toHaveBeenCalledWith('test-project', 'new@example.com');
      expect(mockSetShareModal).toHaveBeenCalled();
      expect(mockSetShareEmail).toHaveBeenCalledWith('');
    });
  });

  it('shows error for invalid email', async () => {
    render(<ShareWorkflowModal {...defaultProps} shareEmail="invalid-email" />);
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.submit(shareButton.closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeDefined();
      expect(mockOnShareWorkflow).not.toHaveBeenCalled();
    });
  });

  it('calls onUnshareWorkflow when remove button is clicked', async () => {
    render(<ShareWorkflowModal {...defaultProps} />);
    
    // Wait for profiles to load
    await waitFor(() => {
      expect(screen.getByText('existing@example.com')).toBeDefined();
    });
    
    const removeButton = screen.getByRole('button', { name: /remove access for existing@example.com/i });
    fireEvent.click(removeButton);
    
    await waitFor(() => {
      expect(mockOnUnshareWorkflow).toHaveBeenCalledWith('test-project', 'existing@example.com');
      expect(mockSetShareModal).toHaveBeenCalled();
    });
  });
});
