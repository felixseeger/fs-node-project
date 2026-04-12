import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import AssetNode from "@/nodes/AssetNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/AssetNode",
  component: AssetNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AssetNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="assetNode"
      nodeComponent={AssetNode}
      data={{
        label: "Asset Library",
        images: [],
        onUpdate: fn(),
        nodeId: "asset-1",
      }}
    />
  ),
};

export const WithImages: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="assetNode"
      nodeComponent={AssetNode}
      data={{
        label: "Brand Assets",
        images: [
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='128' height='128' fill='%23334155'/%3E%3Ctext x='64' y='64' fill='%2394a3b8' text-anchor='middle' dy='0.35em' font-size='12'%3ELogo%3C/text%3E%3C/svg%3E",
        ],
        onUpdate: fn(),
        nodeId: "asset-2",
      }}
    />
  ),
};
