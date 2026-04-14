import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./IconButton";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {
  args: {
    icon: "play",
    variant: "ghost",
  },
};

export const Solid: Story = {
  args: {
    icon: "settings",
    variant: "solid",
  },
};

export const Outline: Story = {
  args: {
    icon: "edit",
    variant: "outline",
  },
};

export const Active: Story = {
  args: {
    icon: "keyframe-active",
    active: true,
  },
};

export const WithCRT: Story = {
  args: {
    icon: "magic",
    crt: true,
    variant: "solid",
  },
};
