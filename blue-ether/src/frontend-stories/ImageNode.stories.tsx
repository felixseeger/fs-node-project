import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import ImageNode from "@/nodes/ImageNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/ImageNode",
  component: ImageNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ImageNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="imageNode"
      nodeComponent={ImageNode}
      data={{ label: "Image Upload", images: [], onUpdate: fn() }}
    />
  ),
};

export const WithImages: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="imageNode"
      nodeComponent={ImageNode}
      data={{
        label: "Reference Images",
        images: [
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23334155'/%3E%3Ctext x='100' y='100' fill='%2394a3b8' text-anchor='middle' dy='0.35em'%3EImage 1%3C/text%3E%3C/svg%3E",
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23475569'/%3E%3Ctext x='100' y='100' fill='%2394a3b8' text-anchor='middle' dy='0.35em'%3EImage 2%3C/text%3E%3C/svg%3E",
        ],
        onUpdate: fn(),
      }}
    />
  ),
};
