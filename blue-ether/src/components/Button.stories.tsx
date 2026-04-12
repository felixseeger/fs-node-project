import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const PrimaryCRT: Story = {
  args: {
    children: "Primary CRT",
    variant: "primary",
    crt: true,
  },
};

export const SecondaryCRT: Story = {
  args: {
    children: "Secondary CRT",
    variant: "secondary",
    crt: true,
  },
};
