export interface NodeProgressProps {
  progress?: number;
  status?: string;
  message?: string;
  compact?: boolean;
}

declare function NodeProgress(props: NodeProgressProps): JSX.Element;
export default NodeProgress;
