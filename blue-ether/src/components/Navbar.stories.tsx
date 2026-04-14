import type { Meta, StoryObj } from '@storybook/react';
import { Navbar, NavLink } from './Navbar';
import Avatar from './Avatar';
import Icon from './Icon';
import Breadcrumb from './Breadcrumb';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, background: 'var(--be-color-accent)', borderRadius: 4 }} />
        <span style={{ fontWeight: 700, fontSize: 16 }}>BlueEther</span>
      </div>
    ),
    leftContent: (
      <div style={{ display: 'flex', gap: 20 }}>
        <NavLink label="Dashboard" icon="grid" active />
        <NavLink label="Projects" icon="workflow" />
        <NavLink label="Library" icon="folder" />
      </div>
    ),
    rightContent: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Icon name="bell" size={20} style={{ color: 'var(--be-color-text-muted)', cursor: 'pointer' }} />
        <Avatar initials="JD" size="sm" crt />
      </div>
    ),
  },
};

export const WithBreadcrumb: Story = {
  args: {
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, background: 'var(--be-color-accent)', borderRadius: 4 }} />
      </div>
    ),
    leftContent: (
      <Breadcrumb 
        items={[
          { label: 'Workspaces', href: '#' },
          { label: 'Neural Network Project', active: true }
        ]} 
      />
    ),
    rightContent: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ padding: '4px 12px', background: 'var(--be-surface-raised)', borderRadius: 20, fontSize: 12, color: 'var(--be-ui-success)' }}>
          ● Ready
        </div>
        <Avatar initials="A" size="sm" />
      </div>
    ),
  },
};

export const Glass: Story = {
  args: {
    ...Default.args,
    glass: true,
    style: { width: '100%', border: '1px solid var(--be-glass-border)' }
  },
};
