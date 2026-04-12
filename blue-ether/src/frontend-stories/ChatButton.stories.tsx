import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import ChatButton from "@/components/ChatButton";

const meta = {
  title: "Frontend/UI/ChatButton",
  component: ChatButton,
  parameters: { layout: "centered", backgrounds: { default: "canvas-dark" } },
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof ChatButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: { isOpen: false, unreadCount: 0 },
};

export const Open: Story = {
  args: { isOpen: true },
};

export const WithUnread: Story = {
  args: { isOpen: false, unreadCount: 3 },
};

export const OverflowBadge: Story = {
  args: { isOpen: false, unreadCount: 15 },
};
