import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BlendModeSelect, type BlendMode } from "./BlendModeSelect";

const meta = {
  title: "Components/BlendModeSelect",
  component: BlendModeSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlendModeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const BlendModeSelectWithState = (args: any) => {
  const [mode, setMode] = useState<BlendMode>(args.value || "normal");
  return (
    <div style={{ width: "250px", padding: "20px", background: "var(--be-bg-base)", borderRadius: "var(--be-radius-md)" }}>
      <BlendModeSelect {...args} value={mode} onChange={setMode} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <BlendModeSelectWithState {...args} />,
  args: {
    label: "Blend Mode",
    value: "normal",
    onChange: () => {},
  },
};

export const NoLabel: Story = {
  render: (args) => <BlendModeSelectWithState {...args} />,
  args: {
    value: "multiply",
    onChange: () => {},
  },
};
