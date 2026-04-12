import React, { type FC } from 'react';
import { Position, Handle, type NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

const SocialPublisherNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { disconnectNode } = useNodeConnections(id, data);
  const platform = (data.platform as string) || 'x';
  const caption = (data.caption as string) || '';
  
  const handleUpdate = (patch: Record<string, any>) => {
    if (typeof data.onUpdate === 'function') {
      data.onUpdate(id, patch);
    }
  };

  return (
    <NodeShell
      label={data.label as string || 'Social Publisher'}
      dotColor="#3b82f6"
      selected={selected}
      onDisconnect={() => disconnectNode()}
      isGenerating={data.isGenerating as boolean}
      hasError={data.hasError as boolean}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Content Input</label>
          <div style={{ background: '#222', padding: 8, borderRadius: 4, position: 'relative' }}>
            <span style={{ color: '#ccc', fontSize: 12 }}>media (image/video)</span>
            <Handle type="target" position={Position.Left} id="media_in" style={{ width: 12, height: 12, background: getHandleColor('any'), border: '2px solid #1e1e1e', left: -14 }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Publish Settings</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#ccc', width: 60 }}>Platform</span>
            <select
              value={platform}
              onChange={(e) => handleUpdate({ platform: e.target.value })}
              className="nodrag"
              style={{ flex: 1, background: '#222', border: '1px solid #444', color: '#ccc', padding: 4, borderRadius: 4, fontSize: 12, outline: 'none' }}
            >
              <option value="x">X (Twitter)</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, color: '#ccc' }}>Caption</span>
            <textarea
              value={caption}
              onChange={(e) => handleUpdate({ caption: e.target.value })}
              placeholder="Post caption..."
              className="nodrag nopan"
              rows={3}
              style={{ background: '#222', border: '1px solid #444', color: '#ccc', padding: 6, borderRadius: 4, fontSize: 12, outline: 'none', resize: 'none', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>
    </NodeShell>
  );
};
export default SocialPublisherNode;
