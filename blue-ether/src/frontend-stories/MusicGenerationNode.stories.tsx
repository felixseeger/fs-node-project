import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import MusicGenerationNode from "@/nodes/MusicGenerationNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/MusicGenerationNode",
  component: MusicGenerationNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MusicGenerationNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="musicGenerationNode"
      nodeComponent={MusicGenerationNode}
      data={{
        label: "Music Generator",
        inputPrompt: "",
        localDuration: 30,
        onUpdate: fn(),
        onGenerate: fn(),
      }}
    />
  ),
};

export const WithPrompt: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="musicGenerationNode"
      nodeComponent={MusicGenerationNode}
      data={{
        label: "Ambient Track",
        inputPrompt: "Calm ambient music with soft synths and rain sounds",
        localDuration: 60,
        onUpdate: fn(),
        onGenerate: fn(),
      }}
    />
  ),
};
