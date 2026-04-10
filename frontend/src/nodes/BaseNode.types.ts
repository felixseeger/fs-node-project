import { ReactNode } from 'react';

export type NodeStatus = "idle" | "loading" | "complete" | "error" | "skipped";

export interface BaseNodeProps {
  id: string;
  label: string;
  children: ReactNode;
  selected?: boolean;
  status?: NodeStatus;
  dotColor?: string;
  // Execution & State
  isExecuting?: boolean;
  hasError?: boolean;
  // Layout & Dimensions
  minWidth?: number;
  minHeight?: number;
  // Settings Panel
  settingsExpanded?: boolean;
  settingsPanel?: ReactNode;
  // Callbacks
  onDisconnect?: () => void;
  onEdit?: () => void;
  onGenerate?: () => void;
  onToggleSettings?: () => void;
  // Other
  downloadUrl?: string;
  downloadType?: 'image' | 'video' | 'audio' | 'svg';
}
