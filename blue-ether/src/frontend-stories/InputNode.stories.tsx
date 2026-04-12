import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import InputNode from "@/nodes/InputNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/InputNode",
  component: InputNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="inputNode"
      nodeComponent={InputNode}
      data={{
        label: "Workflow Input",
        initialFields: ["prompt", "image_urls"],
        onUpdate: fn(),
      }}
    />
  ),
};

export const WithValues: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="inputNode"
      nodeComponent={InputNode}
      data={{
        label: "Image Gen Input",
        initialFields: ["prompt", "aspect_ratio", "num_images"],
        fieldValues: {
          prompt: "A cyberpunk cityscape at night",
          aspect_ratio: "16:9",
          num_images: 4,
        },
        onUpdate: fn(),
      }}
    />
  ),
};
