import type { ReactNode } from "react";
import { ReactFlowProvider, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/**
 * Wraps a story in ReactFlowProvider + a minimal ReactFlow canvas.
 * Use for any component that depends on @xyflow/react (Handle, Position, etc.).
 */
export function ReactFlowDecorator({ children }: { children: ReactNode }) {
  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: 500, position: "relative" }}>
        <ReactFlow
          nodes={[
            {
              id: "story-node",
              type: "default",
              position: { x: 100, y: 100 },
              data: { label: "" },
            },
          ]}
          edges={[]}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 10,
              pointerEvents: "auto",
            }}
          >
            {children}
          </div>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

/**
 * Storybook decorator function for ReactFlow context.
 */
export const withReactFlow = (Story: () => ReactNode) => (
  <ReactFlowDecorator>
    <Story />
  </ReactFlowDecorator>
);
