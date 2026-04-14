import type { Meta, StoryObj } from '@storybook/react';
import Dropdown from './Dropdown';
import { Button } from './Button';
import Avatar from './Avatar';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Navigation/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const items = [
  { id: 'profile', label: 'My profile', icon: 'profile' as const },
  { id: 'settings', label: 'Settings', icon: 'settings' as const },
  { id: 'divider-1', type: 'divider' as const },
  { id: 'logout', label: 'Sign out', icon: 'trash' as const, danger: true },
];

export const Default: Story = {
  args: {
    trigger: <Button variant="secondary">Open Menu</Button>,
    items: items,
  },
};

export const UserMenu: Story = {
  args: {
    trigger: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 8, background: 'var(--be-surface-raised)' }}>
        <Avatar initials="FS" size="sm" crt />
        <span style={{ fontSize: 13, fontWeight: 600 }}>Felix Seeger</span>
      </div>
    ),
    items: items,
    align: 'right',
  },
};
