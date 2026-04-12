import type { Meta, StoryObj } from "@storybook/react";
import DotMatrixDisplay from "@/components/DotMatrixDisplay";

const meta = {
  title: "Frontend/Effects/DotMatrixDisplay",
  component: DotMatrixDisplay,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DotMatrixDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E",
    title: "Workflow Engine",
    description: "Neural Pipeline Active",
  },
};

export const CustomColors: Story = {
  args: {
    iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E",
    title: "Signal Scanner",
    description: "07 Layers Deep",
    activeColor: "#3b82f6",
    scanlineColor: "#a855f7",
  },
};

export const LargeDisplay: Story = {
  args: {
    iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M13 2L3 14h9l-1 10 10-12h-9l1-10z'/%3E%3C/svg%3E",
    title: "Power Grid",
    description: "Status: Online",
    width: 120,
    height: 60,
    dotSize: 4,
    gap: 3,
  },
};
