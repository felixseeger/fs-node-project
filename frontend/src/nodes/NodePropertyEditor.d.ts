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
}

declare const NodePropertyEditor: FC<NodePropertyEditorProps>;
export default NodePropertyEditor;
