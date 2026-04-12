import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import ImageAnalyzerNode from "@/nodes/ImageAnalyzerNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/ImageAnalyzerNode",
  component: ImageAnalyzerNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ImageAnalyzerNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="imageAnalyzerNode"
      nodeComponent={ImageAnalyzerNode}
      data={{
        label: "Vision Analyzer",
        localPrompt: "",
        onUpdate: fn(),
      }}
    />
  ),
};

export const WithResult: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="imageAnalyzerNode"
      nodeComponent={ImageAnalyzerNode}
      data={{
        label: "Vision Analyzer",
        localPrompt: "Describe this image in detail",
        analysisResult: "The image shows a futuristic cityscape at sunset with neon-lit skyscrapers and flying vehicles.",
        onUpdate: fn(),
      }}
    />
  ),
};
