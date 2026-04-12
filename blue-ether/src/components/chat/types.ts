export type ChatMessageType = 'assistant' | 'user' | 'system';

export interface ChatMessageData {
  id: string | number;
  type: ChatMessageType;
  content: string;
  timestamp?: Date | string;
  role?: string;
  isGenerating?: boolean;
}

export interface ChatTag {
  icon?: string;
  label: string;
}
