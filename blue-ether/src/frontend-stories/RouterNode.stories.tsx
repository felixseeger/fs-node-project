import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import RouterNode from "@/nodes/RouterNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/RouterNode",
  component: RouterNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RouterNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="routerNode"
      nodeComponent={RouterNode}
      data={{
        label: "Router",
        outputs: [
          { id: "out-1", label: "Branch A" },
          { id: "out-2", label: "Branch B" },
        ],
        onUpdate: fn(),
      }}
    />
  ),
};

export const ManyOutputs: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="routerNode"
      nodeComponent={RouterNode}
      data={{
        label: "Multi-Router",
        outputs: [
          { id: "out-1", label: "Image Pipeline" },
          { id: "out-2", label: "Video Pipeline" },
          { id: "out-3", label: "Audio Pipeline" },
          { id: "out-4", label: "Text Pipeline" },
        ],
        onUpdate: fn(),
      }}
    />
  ),
};
