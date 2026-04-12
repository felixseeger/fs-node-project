import type { Meta, StoryObj } from "@storybook/react";
import ResponseNode from "@/nodes/ResponseNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/ResponseNode",
  component: ResponseNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ResponseNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="responseNode"
      nodeComponent={ResponseNode}
      data={{
        label: "Response",
        responseFields: [
          { id: "f1", label: "Image", color: "#ec4899" },
          { id: "f2", label: "Prompt", color: "#f97316" },
        ],
      }}
    />
  ),
};

export const WithLinkedFields: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="responseNode"
      nodeComponent={ResponseNode}
      data={{
        label: "Final Output",
        responseFields: [
          {
            id: "f1",
            label: "Generated Image",
            source: { nodeLabel: "SDXL Generator", handle: "output" },
            color: "#ec4899",
          },
          {
            id: "f2",
            label: "Caption",
            source: { nodeLabel: "GPT-4 Vision", handle: "analysis" },
            color: "#f97316",
          },
        ],
      }}
    />
  ),
};
