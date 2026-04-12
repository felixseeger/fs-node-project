import React, { type FC } from 'react';
import { Position, Handle, type NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

const CloudSyncNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { disconnectNode } = useNodeConnections(id, data);
  const provider = (data.provider as string) || 'gdrive';
  const folderPath = (data.folderPath as string) || '/outputs';
  
  const handleUpdate = (patch: Record<string, any>) => {
    if (typeof data.onUpdate === 'function') {
      data.onUpdate(id, patch);
    }
  };

  return (
    <NodeShell
      label={data.label as string || 'Cloud Sync'}
      dotColor="#06b6d4"
      selected={selected}
      onDisconnect={() => disconnectNode()}
      isGenerating={data.isGenerating as boolean}
      hasError={data.hasError as boolean}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>File Input</label>
          <div style={{ background: '#222', padding: 8, borderRadius: 4, position: 'relative' }}>
            <span style={{ color: '#ccc', fontSize: 12 }}>data (any)</span>
            <Handle type="target" position={Position.Left} id="data_in" style={{ width: 12, height: 12, background: getHandleColor('any'), border: '2px solid #1e1e1e', left: -14 }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Sync Configuration</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#ccc', width: 60 }}>Provider</span>
            <select
              value={provider}
              onChange={(e) => handleUpdate({ provider: e.target.value })}
              className="nodrag"
              style={{ flex: 1, background: '#222', border: '1px solid #444', color: '#ccc', padding: 4, borderRadius: 4, fontSize: 12, outline: 'none' }}
            >
              <option value="gdrive">Google Drive</option>
              <option value="s3">AWS S3</option>
              <option value="dropbox">Dropbox</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#ccc', width: 60 }}>Folder</span>
            <input
              type="text"
              value={folderPath}
              onChange={(e) => handleUpdate({ folderPath: e.target.value })}
              placeholder="/outputs"
              className="nodrag nopan"
              style={{ flex: 1, background: '#222', border: '1px solid #444', color: '#ccc', padding: 4, borderRadius: 4, fontSize: 12, outline: 'none' }}
            />
          </div>
        </div>
      </div>
    </NodeShell>
  );
};
export default CloudSyncNode;
