import type { Meta, StoryObj } from "@storybook/react";
import NodeDownloadButton from "@/nodes/NodeDownloadButton";

const meta = {
  title: "Frontend/Nodes/NodeDownloadButton",
  component: NodeDownloadButton,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NodeDownloadButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  args: { url: "https://example.com/image.png", type: "image", size: "md" },
};

export const Video: Story = {
  args: { url: "https://example.com/video.mp4", type: "video", size: "md" },
};

export const Small: Story = {
  args: { url: "https://example.com/file.png", type: "image", size: "sm" },
};
