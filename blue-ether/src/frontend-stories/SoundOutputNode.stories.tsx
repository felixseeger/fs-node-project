import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import SoundOutputNode from "@/nodes/SoundOutputNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/SoundOutputNode",
  component: SoundOutputNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SoundOutputNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="soundOutputNode"
      nodeComponent={SoundOutputNode}
      data={{ label: "Audio Output" }}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="soundOutputNode"
      nodeComponent={SoundOutputNode}
      data={{ label: "Audio Output", isLoading: true }}
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="soundOutputNode"
      nodeComponent={SoundOutputNode}
      data={{
        label: "Audio Output",
        outputError: "Failed to decode audio stream",
      }}
    />
  ),
};
