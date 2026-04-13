export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date | number;
  metadata?: any;
}

export interface ChatSession {
  id?: string;
  userId: string;
  title: string;
  workflowId?: string;
  createdAt?: Date | number;
  updatedAt?: Date | number;
}

export type ChatConversation = ChatSession;
