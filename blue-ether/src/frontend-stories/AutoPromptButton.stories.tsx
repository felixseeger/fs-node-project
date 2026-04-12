import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import AutoPromptButton from "@/nodes/AutoPromptButton";

const meta = {
  title: "Frontend/Nodes/AutoPromptButton",
  component: AutoPromptButton,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AutoPromptButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "node-1",
    data: {},
    update: fn(),
  },
};
