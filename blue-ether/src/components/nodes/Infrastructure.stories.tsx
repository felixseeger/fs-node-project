import type { Meta, StoryObj } from '@storybook/react';
import { 
  LogTerminal, 
  InfrastructureStatus, 
  PropertyGrid 
} from './index';

const meta: Meta = {
  title: 'Design System/Infrastructure',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Terminal: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <LogTerminal 
        logs={[
          { id: 1, timestamp: new Date(), level: 'info', message: 'Initializing Anthropic Claude 3.5 Sonnet...' },
          { id: 2, timestamp: new Date(), level: 'info', message: 'Establishing secure tunnel to us-east-1...' },
          { id: 3, timestamp: new Date(), level: 'success', message: 'Connection established. Handshake complete.' },
          { id: 4, timestamp: new Date(), level: 'info', message: 'Streaming response chunk 0x1A2...' },
          { id: 5, timestamp: new Date(), level: 'warn', message: 'High latency detected on primary gateway.' },
          { id: 6, timestamp: new Date(), level: 'debug', message: 'Retrying chunk validation...' },
          { id: 7, timestamp: new Date(), level: 'error', message: 'Failed to parse multimodal attachment: Invalid Buffer.' },
        ]}
      />
    </div>
  )
};

export const ServiceStatus: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <InfrastructureStatus 
        name="Anthropic API"
        status="online"
        metrics={[
          { label: 'Latency', value: 124, unit: 'ms', status: 'success' },
          { label: 'Uptime', value: 99.98, unit: '%' },
          { label: 'Rate', value: 45, unit: 'req/s' },
          { label: 'Errors', value: 0, unit: '%', status: 'success' },
        ]}
        lastUpdated={new Date()}
      />
      <InfrastructureStatus 
        name="Vector Database"
        status="degraded"
        metrics={[
          { label: 'Latency', value: 850, unit: 'ms', status: 'warning' },
          { label: 'Load', value: 92, unit: '%', status: 'warning' },
          { label: 'Index', value: 'Pinecone-v2', unit: '' },
          { label: 'Memory', value: 4.2, unit: 'GB' },
        ]}
        lastUpdated={new Date()}
      />
    </div>
  )
};

export const ConfigGrid: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <PropertyGrid 
        title="API Configuration"
        properties={[
          { key: 'Provider', value: 'OpenAI', type: 'text' },
          { key: 'API Key', value: 'sk-proj-1234567890', type: 'password' },
          { key: 'Model', value: 'gpt-4o', type: 'tag' },
          { key: 'Streaming', value: true, type: 'boolean' },
          { key: 'Max Tokens', value: 4096, type: 'number' },
          { key: 'Temperature', value: 0.7, type: 'number' },
        ]}
      />
    </div>
  )
};
