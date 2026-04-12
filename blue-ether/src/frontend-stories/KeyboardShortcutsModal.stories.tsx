import type { Meta, StoryObj } from "@storybook/react-vite";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";

const meta = {
  title: "Frontend/UI/KeyboardShortcutsModal",
  component: KeyboardShortcutsModal,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KeyboardShortcutsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
