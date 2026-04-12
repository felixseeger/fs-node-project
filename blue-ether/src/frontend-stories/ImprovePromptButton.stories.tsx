import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import ImprovePromptButton from "@/nodes/ImprovePromptButton";

const meta = {
  title: "Frontend/Nodes/ImprovePromptButton",
  component: ImprovePromptButton,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ImprovePromptButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageType: Story = {
  args: {
    id: "node-1",
    data: {},
    update: fn(),
    type: "image",
  },
};

export const VideoType: Story = {
  args: {
    id: "node-2",
    data: {},
    update: fn(),
    type: "video",
  },
};

export const AudioType: Story = {
  args: {
    id: "node-3",
    data: {},
    update: fn(),
    type: "audio",
  },
};
