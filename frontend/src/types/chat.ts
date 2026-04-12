export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: any; // Firestore Timestamp
  metadata?: {
    workflowId?: string;
    nodeId?: string;
    tokens?: number;
    model?: string;
  };
}

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: any;
  updatedAt: any;
  lastMessage?: string;
  workflowId?: string;
  isDeleted: boolean;
}
