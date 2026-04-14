import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { ExportPanel } from "./ExportPanel";

const meta = {
  title: "Components/ExportPanel",
  component: ExportPanel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ExportPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const ExportPanelWithState = (args: any) => {
  const [isExporting, setIsExporting] = useState(args.isExporting || false);
  const [progress, setProgress] = useState(args.progress || 0);

  useEffect(() => {
    if (isExporting && progress < 100) {
      const timer = setTimeout(() => setProgress((p: number) => Math.min(p + 5, 100)), 200);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
      }, 1000);
    }
  }, [isExporting, progress]);

  return (
    <ExportPanel 
      {...args} 
      isExporting={isExporting} 
      progress={progress}
      onExport={(format, quality) => {
        console.log(`Exporting as ${format} at ${quality} quality`);
        setIsExporting(true);
        setProgress(0);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <ExportPanelWithState {...args} />,
  args: {
    onExport: () => {},},
};

export const Exporting: Story = {
  render: (args) => <ExportPanelWithState {...args} />,
  args: {
    onExport: () => {},
    isExporting: true,
    progress: 45,
  },
};
