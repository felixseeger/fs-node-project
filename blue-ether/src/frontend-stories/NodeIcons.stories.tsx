import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  InfoIcon,
  ChevronDownIcon,
  PublishIcon,
  MagicIcon,
  PlayIcon,
  AspectRatioIcon,
  ResolutionIcon,
  LinkIcon,
} from "@/nodes/NodeIcons";

const IconGrid = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 80px)",
      gap: 24,
      color: "#fff",
    }}
  >
    {[
      { name: "Info", icon: <InfoIcon /> },
      { name: "Chevron", icon: <ChevronDownIcon /> },
      { name: "Publish", icon: <PublishIcon /> },
      { name: "Magic", icon: <MagicIcon /> },
      { name: "Play", icon: <PlayIcon /> },
      { name: "Aspect", icon: <AspectRatioIcon /> },
      { name: "Resolution", icon: <ResolutionIcon /> },
      { name: "Link", icon: <LinkIcon /> },
    ].map(({ name, icon }) => (
      <div
        key={name}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <span style={{ fontSize: 10, opacity: 0.5 }}>{name}</span>
      </div>
    ))}
  </div>
);

const meta = {
  title: "Frontend/Nodes/NodeIcons",
  component: IconGrid,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IconGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {};

export const ChevronExpanded: Story = {
  render: () => (
    <div style={{ color: "#fff", display: "flex", gap: 16, alignItems: "center" }}>
      <ChevronDownIcon expanded={false} />
      <span style={{ fontSize: 12, opacity: 0.5 }}>Collapsed</span>
      <ChevronDownIcon expanded />
      <span style={{ fontSize: 12, opacity: 0.5 }}>Expanded</span>
    </div>
  ),
};
