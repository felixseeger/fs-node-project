import { ReactFlowProvider, ReactFlow, type NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ComponentType, ReactNode } from "react";

/**
 * Renders a single node component inside a working ReactFlow canvas.
 * Used to story full node types (TextNode, CommentNode, etc.).
 */
export function NodeStoryCanvas({
  nodeType,
  nodeComponent,
  data = {},
  position = { x: 50, y: 50 },
  width = 800,
  height = 500,
}: {
  nodeType: string;
  nodeComponent: ComponentType<any>;
  data?: Record<string, unknown>;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
}) {
  const nodeTypes: NodeTypes = { [nodeType]: nodeComponent };

  return (
    <ReactFlowProvider>
      <div style={{ width, height }}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={[
            {
              id: "story-1",
              type: nodeType,
              position,
              data: { label: nodeType, ...data },
            },
          ]}
          edges={[]}
          fitView
          proOptions={{ hideAttribution: true }}
        />
      </div>
    </ReactFlowProvider>
  );
}
