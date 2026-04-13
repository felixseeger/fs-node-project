import type { Meta, StoryObj } from "@storybook/react";
import { Icon, type IconName } from "./Icon";

const meta = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      description: "Name of the icon to display",
    },
    size: {
      control: { type: "range", min: 12, max: 64, step: 2 },
      description: "Size of the icon in pixels",
    },
    color: {
      control: "color",
      description: "Color of the icon (uses currentColor by default)",
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "map",
    size: 24,
  },
};

// All available icons in a grid for reference
const ALL_ICONS: IconName[] = [
  // Basic Actions
  'plus', 'minus', 'close', 'check', 'trash', 'edit', 'copy', 'search', 'settings', 'menu',
  // Navigation
  'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right',
  // Media / Content
  'image', 'video', 'audio', 'text', 'file', 'folder', 'link', 'aspect-ratio', 'resolution',
  // Playback
  'play', 'pause', 'stop', 'rewind', 'fast-forward', 'clock',
  // App / Workspace
  'home', 'grid', 'list', 'layout', 'workflow', 'collage', 'nodes', 'layers',
  // AI / Generation
  'magic', 'sparkles', 'generate', 'brain', 'robot',
  // Communication
  'chat', 'send', 'mic', 'mic-off', 'bell',
  // Users / Social
  'user', 'users', 'profile', 'discord', 'github', 'twitter', 'share', 'globe',
  // Map / Location
  'map', 'map-pin', 'navigation', 'compass', 'target',
  // Extra UI
  'download', 'upload', 'refresh', 'lock', 'unlock', 'eye', 'eye-off', 'info', 'warning', 'error', 'disconnect'
];

export const AllIcons: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '24px', padding: '24px', color: 'var(--color-text)' }}>
      {ALL_ICONS.map(iconName => (
        <div key={iconName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '16px', background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <Icon {...args} name={iconName} />
          </div>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{iconName}</span>
        </div>
      ))}
    </div>
  ),
  args: {
    name: 'plus',
    size: 24,
  },
};
