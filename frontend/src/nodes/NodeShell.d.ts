import type { ReactNode } from 'react';

export interface NodeShellProps {
  label: string;
  dotColor: string;
  selected: boolean;
  children: ReactNode;
  onDisconnect: () => void;
  onEdit?: () => void;
  onGenerate?: () => void | Promise<void>;
  isGenerating?: boolean;
  downloadUrl?: string;
  downloadType?: 'image' | 'video' | 'audio' | 'svg';
  hasError?: boolean;
  data?: Record<string, unknown> & {
    folded?: boolean;
    muted?: boolean;
    nodeId?: string;
    onUpdate?: (nodeId: string, patch: Record<string, unknown>) => void;
  };
  folded?: boolean;
  onToggleFold?: () => void;
}

declare function NodeShell(props: NodeShellProps): JSX.Element;
export default NodeShell;
