import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { useState } from "react";
import AnnotationMenu from "@/components/AnnotationMenu";

const meta = {
  title: "Frontend/UI/AnnotationMenu",
  component: AnnotationMenu,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
  args: {
    onColorChange: fn(),
    onToolChange: fn(),
  },
} satisfies Meta<typeof AnnotationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DrawTool: Story = {
  args: {
    selectedColorHex: "#ef4444",
    tool: "draw",
  },
};

export const TextTool: Story = {
  args: {
    selectedColorHex: "#3b82f6",
    tool: "text",
  },
};

export const PanTool: Story = {
  args: {
    selectedColorHex: "#22c55e",
    tool: "pan",
  },
};

const InteractiveAnnotationMenu = () => {
  const [color, setColor] = useState("#ef4444");
  const [tool, setTool] = useState<"draw" | "text" | "pan">("draw");
  return (
    <AnnotationMenu
      selectedColorHex={color}
      onColorChange={setColor}
      tool={tool}
      onToolChange={setTool}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveAnnotationMenu />,
  args: {
    selectedColorHex: "#ef4444",
    tool: "draw",
  },
};
