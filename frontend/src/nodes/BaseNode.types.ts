import { type ReactNode } from 'react';

export type NodeStatus = "idle" | "loading" | "complete" | "error" | "skipped";

export interface EditableTitleConfig {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface BaseNodeProps {
  id: string;
  label: string;
  /** When set, header shows an inline editable title instead of static `label`. */
  editableTitle?: EditableTitleConfig;
  children: ReactNode;
  selected?: boolean;
  status?: NodeStatus;
  dotColor?: string;
  // Capabilities
  capabilities?: string[];
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
  modelName?: string;
}
