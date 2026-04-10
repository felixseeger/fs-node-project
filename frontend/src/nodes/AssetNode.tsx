import React, { useRef, useState, useCallback, FC, ChangeEvent, DragEvent, ReactNode } from 'react';
import UpdateAssetModal from '../UpdateAssetModal';
import { Handle, Position, NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { sp, CATEGORY_COLORS, font } from './nodeTokens';

const Icons = {
  Upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  Plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
};

/**
 * AssetNode - Repository for media assets
 */
const AssetNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { disconnectNode } = useNodeConnections(id, data);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const images = (data.images as string[]) || [];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );

    if (!fileArray.length) {
      console.warn('AssetNode: No valid image/video files found');
      return;
    }

    console.log('AssetNode: Processing', fileArray.length, 'files');

    // Read all files in parallel
    const readPromises = fileArray.map(file => {
      return new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.onerror = (err) => {
          console.error('AssetNode: FileReader error for', file.name, err);
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.all(readPromises);
    const newImages = results.filter((res): res is string => res !== null);

    if (newImages.length > 0 && typeof data.onUpdate === 'function') {
      data.onUpdate(id, { images: [...images, ...newImages] });
    }
  }, [id, data, images]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  return (
    <>
      <NodeShell data={data}
        label={(data.label as string) || 'Asset'}
        dotColor={CATEGORY_COLORS.input}
        selected={selected}
        onDisconnect={disconnectNode}
        onEdit={() => setIsUpdateModalOpen(true)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp[4] }}>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {images.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: sp[2] }}>
              {images.map((src, i) => (
                <div key={i} style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid #333' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Asset ${i}`} />
                </div>
              ))}
              <button
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  border: isDragging ? '2px dashed #3b82f6' : '1px dashed #444',
                  background: isDragging ? 'rgba(59,130,246,0.2)' : '#222',
                  color: isDragging ? '#3b82f6' : '#888',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 0,
                  padding: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ width: 24, height: 24 }}>{Icons.Plus}</span>
              </button>
            </div>
          ) : (
            <div
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                padding: sp[4],
                border: isDragging ? '2px dashed #3b82f6' : '1px dashed #444',
                borderRadius: 8,
                background: isDragging ? 'rgba(59,130,246,0.1)' : '#222',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: sp[2],
                cursor: 'pointer',
                color: isDragging ? '#3b82f6' : '#888',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ width: 24, height: 24 }}>{Icons.Upload}</span>
              <span style={{ ...font.sm, fontWeight: 500 }}>
                {isDragging ? 'Drop files here' : 'Upload Media'}
              </span>
            </div>
          )}

        </div>
        <Handle type="source" position={Position.Right} style={{ top: 40 }} />
      </NodeShell>
      <UpdateAssetModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        nodeData={{ id, label: (data.label as string) || (data.name as string), images }}
        onUpdate={(nodeId, patch) => (data.onUpdate as Function)?.(nodeId, patch)}
      />
    </>);
};

export default AssetNode;
