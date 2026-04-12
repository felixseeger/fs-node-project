import type { Meta, StoryObj } from "@storybook/react";

import Avatar from "./Avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=12",
    alt: "Portrait of a user",
    name: "Alex Morgan",
    size: "md",
  },
};

export const InitialsOnly: Story = {
  args: {
    name: "Jordan Lee",
    size: "md",
  },
};

export const CustomInitials: Story = {
  args: {
    initials: "AB",
    alt: "Account AB",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    name: "Sam Taylor",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    name: "River Chen",
    size: "lg",
  },
};

export const BrokenImageFallsBack: Story = {
  args: {
    src: "https://example.invalid/does-not-exist.jpg",
    name: "Fallback User",
    alt: "User with broken image",
    size: "md",
  },
};

export const WithCrtEffect: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=12",
    alt: "Portrait with CRT overlay",
    name: "Alex Morgan",
    size: "md",
    crt: true,
  },
};

export const InitialsOnlyWithCrt: Story = {
  args: {
    name: "Jordan Lee",
    size: "md",
    crt: true,
  },
};

export const CustomInitialsWithCrt: Story = {
  args: {
    initials: "AB",
    alt: "Account AB",
    size: "md",
    crt: true,
  },
};
