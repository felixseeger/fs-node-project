import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShareWorkflowModal } from '../ShareWorkflowModal';

// Mock Firebase config
vi.mock('../../../config/firebase', () => ({
  getDb: vi.fn(() => ({})),
  isFirebaseConfigured: vi.fn(() => true),
}));

// Mock Firestore
const mockGetDocs = vi.fn();
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: (...args: any[]) => mockGetDocs(...args),
}));

describe('ShareWorkflowModal', () => {
  const mockSetShareEmail = vi.fn();
  const mockSetShareModal = vi.fn();
  const mockOnShareWorkflow = vi.fn();
  const mockOnUnshareWorkflow = vi.fn();

  const defaultProps = {
    shareModal: { projectId: 'proj-1', sharedWith: [] },
    shareEmail: '',
    setShareEmail: mockSetShareEmail,
    setShareModal: mockSetShareModal,
    onShareWorkflow: mockOnShareWorkflow,
    onUnshareWorkflow: mockOnUnshareWorkflow,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ShareWorkflowModal {...defaultProps} />);
    expect(screen.getByText('Share Workflow')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search or enter email address...')).toBeInTheDocument();
  });

  it('shows error for invalid email', async () => {
    render(<ShareWorkflowModal {...defaultProps} shareEmail="invalid-email" />);
    
    fireEvent.submit(screen.getByRole('button', { name: 'Share' }).closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });
    expect(mockOnShareWorkflow).not.toHaveBeenCalled();
  });

  it('shows error if user not found in Firestore', async () => {
    mockGetDocs.mockResolvedValueOnce({ empty: true });
    
    render(<ShareWorkflowModal {...defaultProps} shareEmail="test@example.com" />);
    
    fireEvent.submit(screen.getByRole('button', { name: 'Share' }).closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText('No user found with email test@example.com')).toBeInTheDocument();
    });
    expect(mockOnShareWorkflow).not.toHaveBeenCalled();
  });

  it('calls onShareWorkflow if user is found', async () => {
    mockGetDocs.mockResolvedValueOnce({
      empty: false,
      docs: [{ data: () => ({ email: 'test@example.com', displayName: 'Test User' }) }]
    });
    
    render(<ShareWorkflowModal {...defaultProps} shareEmail="test@example.com" />);
    
    fireEvent.submit(screen.getByRole('button', { name: 'Share' }).closest('form')!);
    
    await waitFor(() => {
      expect(mockOnShareWorkflow).toHaveBeenCalledWith('proj-1', 'test@example.com');
      expect(screen.getByText('Workflow shared with test@example.com')).toBeInTheDocument();
    });
  });

  it('displays shared users and fetches their profiles', async () => {
    mockGetDocs.mockResolvedValueOnce({
      forEach: (cb: any) => {
        cb({ data: () => ({ email: 'shared@example.com', displayName: 'Shared User' }) });
      }
    });

    render(<ShareWorkflowModal {...defaultProps} shareModal={{ projectId: 'proj-1', sharedWith: ['shared@example.com'] }} />);
    
    await waitFor(() => {
      expect(screen.getByText('Shared with (1)')).toBeInTheDocument();
      expect(screen.getByText('Shared User')).toBeInTheDocument();
    });
  });

  it('calls onUnshareWorkflow when remove is clicked', async () => {
    mockGetDocs.mockResolvedValueOnce({
      forEach: (cb: any) => {
        cb({ data: () => ({ email: 'shared@example.com', displayName: 'Shared User' }) });
      }
    });

    render(<ShareWorkflowModal {...defaultProps} shareModal={{ projectId: 'proj-1', sharedWith: ['shared@example.com'] }} />);
    
    await waitFor(() => {
      expect(screen.getByText('Shared User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Remove access for shared@example.com' }));

    await waitFor(() => {
      expect(mockOnUnshareWorkflow).toHaveBeenCalledWith('proj-1', 'shared@example.com');
    });
  });
});
