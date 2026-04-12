import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import CommentNode from "@/nodes/CommentNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/CommentNode",
  component: CommentNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CommentNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="commentNode"
      nodeComponent={CommentNode}
      data={{ text: "", onUpdate: fn() }}
    />
  ),
};

export const WithNote: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="commentNode"
      nodeComponent={CommentNode}
      data={{
        text: "TODO: Connect this to the image analyzer for automatic tagging",
        onUpdate: fn(),
      }}
    />
  ),
};
