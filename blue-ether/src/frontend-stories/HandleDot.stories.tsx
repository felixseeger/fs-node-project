import type { Meta, StoryObj } from "@storybook/react";
import HandleDot from "@/nodes/HandleDot";
import { withReactFlow } from "./decorators/ReactFlowDecorator";

const meta = {
  title: "Frontend/Nodes/HandleDot",
  component: HandleDot,
  parameters: { backgrounds: { default: "canvas-dark" } },
  tags: ["autodocs"],
  decorators: [withReactFlow],
} satisfies Meta<typeof HandleDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TargetLeft: Story = {
  args: { type: "target", position: "left", id: "prompt-in", label: "Prompt" },
};

export const SourceRight: Story = {
  args: { type: "source", position: "right", id: "output", label: "Output" },
};

export const ImageHandle: Story = {
  args: { type: "target", position: "left", id: "image-in", label: "Image" },
};

export const VideoHandle: Story = {
  args: { type: "source", position: "right", id: "output-video", label: "Video" },
};
