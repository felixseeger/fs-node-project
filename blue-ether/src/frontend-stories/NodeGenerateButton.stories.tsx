import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import NodeGenerateButton from "@/nodes/NodeGenerateButton";

const meta = {
  title: "Frontend/Nodes/NodeGenerateButton",
  component: NodeGenerateButton,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
  args: { onGenerate: fn() },
} satisfies Meta<typeof NodeGenerateButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: "md" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Generating: Story = {
  args: { isGenerating: true },
};
