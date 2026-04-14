import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollaborationHub, CollaborationPresence } from '../CollaborationHub';

// Mock dependencies
vi.mock('../../store', () => ({
  useStore: vi.fn(() => ({
    currentWorkflow: { id: 'test-workflow', name: 'Test Workflow' }
  }))
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { uid: 'user-1', displayName: 'John Doe' }
  }))
}));

vi.mock('../../hooks/useUser', () => ({
  useUser: vi.fn(() => ({
    profile: { displayName: 'John Doe', themeColor: '#3b82f6' }
  }))
}));

const mockSendMessage = vi.fn();
const mockUpdateCursor = vi.fn();
const mockLockNode = vi.fn();
const mockUnlockNode = vi.fn();
const mockTrackAction = vi.fn();

vi.mock('../../hooks/useCollaboration', () => ({
  useCollaboration: vi.fn(() => ({
    collaborators: [
      { id: 'user-2', name: 'Sarah', color: '#ec4899', avatar: 'S', status: 'online' }
    ],
    actionFeed: [
      { id: '1', userName: 'Sarah', action: 'added', target: 'Image Node', timestamp: { toDate: () => new Date() } }
    ],
    messages: [
      { id: 'm1', senderId: 'user-2', senderName: 'Sarah', text: 'Hello!', timestamp: { toDate: () => new Date() }, type: 'message' }
    ],
    locks: [],
    sendMessage: mockSendMessage,
    updateCursor: mockUpdateCursor,
    lockNode: mockLockNode,
    unlockNode: mockUnlockNode,
    trackAction: mockTrackAction
  }))
}));

vi.mock('../../config/firebase', () => ({
  isFirebaseConfigured: vi.fn(() => true)
}));

// Mock @xyflow/react
vi.mock('@xyflow/react', () => ({
  useViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
  useNodes: vi.fn(() => [])
}));

describe('CollaborationHub', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<CollaborationHub isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText(/Collaboration Hub/i)).toBeDefined();
    expect(screen.getByText('Team')).toBeDefined();
    expect(screen.getByText('Chat')).toBeDefined();
    expect(screen.getByText('History')).toBeDefined();
  });

  it('shows collaborators in the Team tab', () => {
    render(<CollaborationHub isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText(/John Doe/i)).toBeDefined();
    expect(screen.getByText('Sarah')).toBeDefined();
  });

  it('switches to Chat tab and shows messages', () => {
    render(<CollaborationHub isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Chat'));
    
    expect(screen.getByText('Hello!')).toBeDefined();
    expect(screen.getByPlaceholderText('Type a message...')).toBeDefined();
  });

  it('calls sendMessage when send button is clicked', () => {
    render(<CollaborationHub isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Chat'));
    
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Hey team' } });
    
    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);
    
    expect(mockSendMessage).toHaveBeenCalledWith('Hey team');
  });

  it('switches to History tab and shows actions', () => {
    render(<CollaborationHub isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('History'));
    
    expect(screen.getByText(/added/i)).toBeDefined();
    expect(screen.getByText(/Image Node/i)).toBeDefined();
  });

  it('calls onClose when close button is clicked', () => {
    render(<CollaborationHub isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByLabelText('Close collaboration hub'));
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});

describe('CollaborationPresence', () => {
  it('renders correctly showing collaborator count', () => {
    render(<CollaborationPresence />);
    
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText(/collaborators/i)).toBeDefined();
    expect(screen.getByTitle('You')).toBeDefined();
    expect(screen.getByTitle('Sarah')).toBeDefined();
  });
});
