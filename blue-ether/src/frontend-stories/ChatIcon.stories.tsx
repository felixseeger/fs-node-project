import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import ChatIcon from "@/components/ChatIcon";

const meta = {
  title: "Frontend/UI/ChatIcon",
  component: ChatIcon,
  parameters: { layout: "centered", backgrounds: { default: "canvas-dark" } },
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof ChatIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: { isOpen: false, unreadCount: 0 },
};

export const Open: Story = {
  args: { isOpen: true, unreadCount: 0 },
};

export const WithUnread: Story = {
  args: { isOpen: false, unreadCount: 5 },
};

export const WithManyUnread: Story = {
  args: { isOpen: false, unreadCount: 42 },
};
