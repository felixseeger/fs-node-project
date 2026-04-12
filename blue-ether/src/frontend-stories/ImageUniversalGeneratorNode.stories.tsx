import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import ImageUniversalGeneratorNode from "@/nodes/ImageUniversalGeneratorNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/ImageUniversalGeneratorNode",
  component: ImageUniversalGeneratorNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ImageUniversalGeneratorNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="imageUniversalGenerator"
      nodeComponent={ImageUniversalGeneratorNode}
      data={{
        label: "Universal Image Gen",
        inputPrompt: "",
        aspectRatio: "1:1",
        numOutputs: 1,
        models: [],
        onUpdate: fn(),
      }}
      width={900}
      height={600}
    />
  ),
};

export const WithPrompt: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="imageUniversalGenerator"
      nodeComponent={ImageUniversalGeneratorNode}
      data={{
        label: "Universal Image Gen",
        inputPrompt: "A magical forest with bioluminescent trees and floating crystals",
        aspectRatio: "16:9",
        numOutputs: 4,
        models: [],
        onUpdate: fn(),
      }}
      width={900}
      height={600}
    />
  ),
};
