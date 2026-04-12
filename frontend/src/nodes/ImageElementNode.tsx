import React, { useCallback, type FC } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS } from './nodeTokens';

/**
 * ImageElementNode - A simple image element on the canvas
 * Supports drag & drop and paste from clipboard (handled in App.tsx)
 */
const ImageElementNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { disconnectNode } = useNodeConnections(id, data);
  const imageUrl = data.imageUrl as string;

  const handleSendToChat = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageUrl) {
      window.dispatchEvent(new CustomEvent('send-to-chat', { 
        detail: { images: [imageUrl], name: 'Canvas Image' } 
      }));
    }
  }, [imageUrl]);

  return (
    <NodeShell 
      data={data}
      label={(data.label as string) || 'Image Element'}
      dotColor={CATEGORY_COLORS.imageGeneration}
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <div className="flex flex-col gap-2 p-2 min-w-[150px]">
        {imageUrl ? (
          <div className="relative group overflow-hidden rounded-lg border border-slate-800 bg-slate-950 aspect-square flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt="Element" 
              className="max-w-full max-h-full object-contain nodrag nopan"
            />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={handleSendToChat}
                className="nodrag nopan p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg transition-transform hover:scale-110"
                title="Send to Chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
            No Image
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Handle
            type="target"
            position={Position.Left}
            id="image-in"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: getHandleColor('image-in'),
              border: 'none',
              position: 'relative',
              left: -18,
            }}
          />
          
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Image Output</div>
          
          <Handle
            type="source"
            position={Position.Right}
            id="image-out"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: getHandleColor('image-out'),
              border: 'none',
              position: 'relative',
              right: -18,
            }}
          />
        </div>
      </div>
    </NodeShell>
  );
};

export default ImageElementNode;
