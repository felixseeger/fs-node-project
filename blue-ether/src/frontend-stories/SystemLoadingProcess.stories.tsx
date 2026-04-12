import type { Meta, StoryObj } from "@storybook/react-vite";
import SystemLoadingProcess from "@/components/SystemLoadingProcess";

const meta = {
  title: "Frontend/Effects/SystemLoadingProcess",
  component: SystemLoadingProcess,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SystemLoadingProcess>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    autoStart: true,
    requireInteraction: true,
  },
};

export const AutoContinue: Story = {
  args: {
    autoStart: true,
    requireInteraction: false,
    autoContinueDelayMs: 2000,
  },
};

export const CustomConfig: Story = {
  args: {
    autoStart: true,
    requireInteraction: true,
    config: {
      title: "Connecting",
      phases: [
        { label: "Neural Link", value: "Established" },
        { label: "Data Stream", value: "12 Channels" },
      ],
      code: "NX-09",
      engageText: "Launch",
      successText: "System Online",
    },
  },
};
