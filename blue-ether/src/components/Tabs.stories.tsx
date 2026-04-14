import type { Meta, StoryObj } from '@storybook/react';
import Tabs from './Tabs';
import Icon from './Icon';
import { useState } from 'react';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Pill: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState('interface');
    return (
      <Tabs 
        {...args} 
        tabs={[
          { id: 'interface', label: 'Interface' },
          { id: 'node-editor', label: 'Node Editor' }
        ]}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        variant="pill"
      />
    );
  }
};

export const Underline: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState('workflows');
    return (
      <Tabs 
        {...args} 
        tabs={[
          { id: 'workflows', label: 'Workflows', icon: <Icon name="workflow" size={14} /> },
          { id: 'assets', label: 'Assets', icon: <Icon name="folder" size={14} /> },
          { id: 'community', label: 'Community', icon: <Icon name="globe" size={14} /> }
        ]}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />
    );
  }
};
