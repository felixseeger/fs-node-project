import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar, SidebarItem } from './Sidebar';
import Avatar from './Avatar';
import React, { useState } from 'react';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const [active, setActive] = useState('workflows');

    return (
      <div style={{ height: '500px', display: 'flex' }}>
        <Sidebar 
          {...args} 
          isOpen={isOpen} 
          onToggle={() => setIsOpen(!isOpen)}
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, background: 'var(--be-color-accent)', borderRadius: 8 }} />
              {isOpen && <span style={{ fontWeight: 700 }}>Nodespace</span>}
            </div>
          }
          footer={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar initials="JD" size="sm" crt />
              {isOpen && <div style={{ fontSize: 12 }}><div style={{ fontWeight: 600 }}>John Doe</div><div style={{ opacity: 0.5 }}>Pro Plan</div></div>}
            </div>
          }
        >
          <SidebarItem 
            label="Workflows" 
            icon="workflow" 
            active={active === 'workflows'} 
            onClick={() => setActive('workflows')}
            collapsed={!isOpen}
          />
          <SidebarItem 
            label="Assets" 
            icon="folder" 
            active={active === 'assets'} 
            onClick={() => setActive('assets')}
            collapsed={!isOpen}
            badge={12}
          />
          <SidebarItem 
            label="Community" 
            icon="globe" 
            active={active === 'community'} 
            onClick={() => setActive('community')}
            collapsed={!isOpen}
          />
          <SidebarItem 
            label="Settings" 
            icon="settings" 
            active={active === 'settings'} 
            onClick={() => setActive('settings')}
            collapsed={!isOpen}
          />
        </Sidebar>
        <div style={{ flex: 1, padding: 40, background: 'var(--be-color-bg)', color: 'var(--be-color-text)' }}>
          <h1>Main Content</h1>
          <p>The sidebar can be toggled or used in fixed mode.</p>
        </div>
      </div>
    );
  }
};
