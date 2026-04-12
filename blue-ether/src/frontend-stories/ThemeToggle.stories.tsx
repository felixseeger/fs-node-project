import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const meta = {
  title: "Frontend/UI/ThemeToggle",
  component: ThemeToggle,
  parameters: { layout: "centered", backgrounds: { default: "canvas-dark" } },
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const ThemeToggleControlled = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#fff" }}>
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <span style={{ fontSize: 13, opacity: 0.6 }}>Current: {theme}</span>
    </div>
  );
};

export const Dark: Story = {
  args: { theme: "dark", setTheme: () => {} },
};

export const Light: Story = {
  args: { theme: "light", setTheme: () => {} },
};

export const Interactive: Story = {
  render: () => <ThemeToggleControlled />,
  args: { theme: "dark", setTheme: () => {} },
};
