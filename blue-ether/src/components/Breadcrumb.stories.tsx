import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Workspaces', href: '#' },
      { label: 'Project Name', active: true },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Workspaces', href: '#' },
      { label: 'Project Name', active: true },
    ],
    separator: <span style={{ color: 'var(--be-color-accent)', margin: '0 8px' }}>→</span>,
  },
};
