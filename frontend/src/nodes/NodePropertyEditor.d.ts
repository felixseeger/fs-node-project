import type { FC } from 'react';

export interface NodePropertyEditorProps {
  node: unknown;
  edges?: unknown[];
  allNodes?: unknown[];
  onUpdate?: (nodeId: string, patch: unknown) => void;
  onDelete?: (nodeId: string) => void;
  compact?: boolean;
  /** Opens the model mega menu (image/video universal generators). */
  onOpenModelMegaMenu?: () => void;
  /** Inspector-only: run this single generator node (same path as scoped canvas run). */
  onRunNode?: () => void;
  /** Global workflow run in progress — disables Run in inspector. */
  isRunning?: boolean;
}

declare const NodePropertyEditor: FC<NodePropertyEditorProps>;
export default NodePropertyEditor;
