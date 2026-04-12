import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import GeneratorNode from "@/nodes/GeneratorNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/GeneratorNode",
  component: GeneratorNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GeneratorNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="generatorNode"
      nodeComponent={GeneratorNode}
      data={{
        label: "Image Generator",
        generatorType: "image",
        inputPrompt: "",
        localAspectRatio: "1:1",
        localResolution: "1024x1024",
        localNumImages: 1,
        onUpdate: fn(),
      }}
    />
  ),
};

export const WithPrompt: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="generatorNode"
      nodeComponent={GeneratorNode}
      data={{
        label: "SDXL Generator",
        generatorType: "image",
        inputPrompt: "A serene mountain landscape with northern lights",
        localAspectRatio: "16:9",
        localResolution: "1536x1024",
        localNumImages: 4,
        onUpdate: fn(),
      }}
    />
  ),
};

export const WithOutput: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="generatorNode"
      nodeComponent={GeneratorNode}
      data={{
        label: "Generator (Complete)",
        generatorType: "image",
        inputPrompt: "Cyberpunk neon city",
        localAspectRatio: "1:1",
        localResolution: "1024x1024",
        localNumImages: 1,
        outputImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect width='256' height='256' fill='%23334155'/%3E%3Ctext x='128' y='128' fill='%2394a3b8' text-anchor='middle' dy='0.35em' font-size='14'%3EGenerated%3C/text%3E%3C/svg%3E",
        onUpdate: fn(),
      }}
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="generatorNode"
      nodeComponent={GeneratorNode}
      data={{
        label: "Generator (Error)",
        generatorType: "image",
        inputPrompt: "test",
        localAspectRatio: "1:1",
        localResolution: "1024x1024",
        localNumImages: 1,
        outputError: "Rate limit exceeded. Please wait 30 seconds.",
        onUpdate: fn(),
      }}
    />
  ),
};
