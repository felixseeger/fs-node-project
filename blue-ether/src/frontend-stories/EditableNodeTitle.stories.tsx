import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import EditableNodeTitle from "@/nodes/EditableNodeTitle";

const meta = {
  title: "Frontend/Nodes/EditableNodeTitle",
  component: EditableNodeTitle,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
  args: { onCommit: fn() },
} satisfies Meta<typeof EditableNodeTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: "Image Generator", placeholder: "Enter title..." },
};

export const Empty: Story = {
  args: { value: "", placeholder: "Untitled Node" },
};

export const Disabled: Story = {
  args: { value: "Locked Title", disabled: true },
};

export const Small: Story = {
  args: { value: "Compact", size: "sm" },
};
