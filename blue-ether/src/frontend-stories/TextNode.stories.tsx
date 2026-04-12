import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import TextNode from "@/nodes/TextNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/TextNode",
  component: TextNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="textNode"
      nodeComponent={TextNode}
      data={{ label: "Text Prompt", text: "", onUpdate: fn() }}
    />
  ),
};

export const WithText: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="textNode"
      nodeComponent={TextNode}
      data={{
        label: "System Prompt",
        text: "A photorealistic landscape of a futuristic city at sunset, cyberpunk aesthetic",
        onUpdate: fn(),
      }}
    />
  ),
};
