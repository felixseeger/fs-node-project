/**
 * AssetNode - Hardened React Flow node for asset management
 * 
 * Features:
 * - Strict type definitions for node data
 * - Safe property access with runtime validation
 * - File validation before processing
 * - Proper error boundaries
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { type Asset, type AssetMediaItem } from '../types/asset';
import { type BaseNodeData } from '../types/nodes';
import useNodeConnections from './useNodeConnections';

/**
 * AssetNode data structure
 */
export interface AssetNodeData extends BaseNodeData {
  /** Node display label */
  label: string;
  /** Asset ID reference */
  assetId?: string;
  /** Full asset data (when embedded) */
  asset?: Asset;
  /** Image URLs for display */
  images: string[];
  /** Media items with metadata */
  mediaItems?: AssetMediaItem[];
  /** Whether asset has unsaved changes */
  isDirty?: boolean;
  /** Callback to update node data (legacy) */
  onDataUpdate?: (data: Partial<AssetNodeData>) => void;
  /** Callback to show update modal */
  onShowUpdateModal?: (nodeId: string, data: AssetNodeData) => void;
  /** Callback to add images */
  onAddImages?: (nodeId: string, images: string[]) => void;
  /** Node ID reference */
  nodeId: string;
}

/**
 * File validation result
 */
interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Image validation state
 */
interface ImageValidationState {
  isValidating: boolean;
  errors: Record<string, string>;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGES_PER_NODE = 50;

/**
 * Type guard for AssetNodeData
 */
function isAssetNodeData(data: unknown): data is AssetNodeData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    Array.isArray(d.images) &&
    typeof d.label === 'string' &&
    typeof d.nodeId === 'string'
  );
}

/**
 * Validate file before processing
 */
function validateFile(file: File): FileValidationResult {
  const errors: string[] = [];

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    errors.push(`${file.name}: Invalid type. Allowed: JPG, PNG, WebP, GIF`);
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`${file.name}: Too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * AssetNode React Flow component
 * 
 * @param props - Node props from React Flow
 */
export function AssetNode({ id, data, selected }: NodeProps<Node<AssetNodeData>>): React.ReactElement {
  
  // Validate data structure
  if (!isAssetNodeData(data)) {
    console.error('[AssetNode] Invalid node data:', data);
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
        Invalid node data
      </div>
    );
  }

  // Cast data to AssetNodeData after validation
  const nodeData = data as AssetNodeData;

  const [isDragging, setIsDragging] = useState(false);
  const [validationState, setValidationState] = useState<ImageValidationState>({
    isValidating: false,
    errors: {},
  });

  const { update, disconnectNode } = useNodeConnections(id, nodeData);

  // Safe property access with defaults
  const nodeLabel = nodeData.label ?? 'Asset Repository';
  const images = useMemo(() => {
    // Ensure all images are valid strings
    return nodeData.images.filter((img): img is string => 
      typeof img === 'string' && img.length > 0
    );
  }, [nodeData.images]);
  
  const assetName = nodeData.asset?.name ?? nodeLabel;
  const isDirty = nodeData.isDirty ?? false;

  /**
   * Handle file processing
   */
  const processFiles = useCallback(async (files: FileList): Promise<string[]> => {
    const processed: string[] = [];
    const errors: Record<string, string> = {};

    setValidationState(prev => ({ ...prev, isValidating: true }));

    for (const file of Array.from(files)) {
      const validation = validateFile(file);
      if (!validation.valid) {
        errors[file.name] = validation.errors.join('; ');
        continue;
      }

      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
              resolve(result);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = () => reject(new Error('File read error'));
          reader.readAsDataURL(file);
        });
        processed.push(dataUrl);
      } catch (err) {
        errors[file.name] = err instanceof Error ? err.message : 'Read failed';
      }
    }

    setValidationState({
      isValidating: false,
      errors,
    });

    return processed;
  }, []);

  /**
   * Handle file drop
   */
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Check max images
    if (images.length >= MAX_IMAGES_PER_NODE) {
      setValidationState(prev => ({
        ...prev,
        errors: { general: `Maximum ${MAX_IMAGES_PER_NODE} images allowed` },
      }));
      return;
    }

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Process files
    const newImages = await processFiles(files);
    
    if (newImages.length > 0) {
      // Calculate how many we can add
      const availableSlots = MAX_IMAGES_PER_NODE - images.length;
      const imagesToAdd = newImages.slice(0, availableSlots);

      // Update via callback
      if (nodeData.onAddImages) {
        nodeData.onAddImages(id, imagesToAdd);
      } else {
        update({
          images: [...images, ...imagesToAdd],
          isDirty: true,
        });
      }

    }
  }, [images, nodeData, id, processFiles]);

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  /**
   * Handle click to show update modal
   */
  const handleShowUpdateModal = useCallback(() => {
    if (nodeData.onShowUpdateModal) {
      nodeData.onShowUpdateModal(id, nodeData);
    }
  }, [nodeData, id]);

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check max images
    if (images.length >= MAX_IMAGES_PER_NODE) {
      setValidationState(prev => ({
        ...prev,
        errors: { general: `Maximum ${MAX_IMAGES_PER_NODE} images allowed` },
      }));
      return;
    }

    const newImages = await processFiles(files);
    
    if (newImages.length > 0) {
      const availableSlots = MAX_IMAGES_PER_NODE - images.length;
      const imagesToAdd = newImages.slice(0, availableSlots);

      if (nodeData.onAddImages) {
        nodeData.onAddImages(id, imagesToAdd);
      } else {
        update({
          images: [...images, ...imagesToAdd],
          isDirty: true,
        });
      }

    }

    // Reset input
    e.target.value = '';
  }, [images, nodeData, id, processFiles]);

  return (
    <div
      className={`
        relative bg-gray-800 border-2 rounded-lg p-4 min-w-[280px] max-w-[400px]
        ${isDragging ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600'}
        ${isDirty ? 'border-yellow-500/50' : ''}
        transition-colors duration-200
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Drag indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-blue-400 font-medium">Drop images here</span>
        </div>
      )}

      {/* Node header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-white font-medium truncate max-w-[180px]" title={assetName}>
            {assetName}
          </h3>
          {isDirty && (
            <span className="text-yellow-500 text-xs" title="Unsaved changes">●</span>
          )}
        </div>
        <span className="text-gray-500 text-xs">{images.length} images</span>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {images.slice(0, 6).map((image, index) => (
          <div key={index} className="relative aspect-square bg-gray-700 rounded overflow-hidden">
            <img
              src={image}
              alt={`Asset ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Replace with placeholder on error
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>';
              }}
            />
            {index === 5 && images.length > 6 && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-white font-medium">+{images.length - 6}</span>
              </div>
            )}
          </div>
        ))}
        
        {/* Add image button */}
        {images.length < MAX_IMAGES_PER_NODE && (
          <label className="aspect-square bg-gray-700/50 border-2 border-dashed border-gray-600 rounded flex items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-700 transition-colors">
            <input
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              multiple
              className="hidden"
              onChange={handleFileInputChange}
              disabled={validationState.isValidating}
            />
            {validationState.isValidating ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </label>
        )}
      </div>

      {/* Validation errors */}
      {Object.entries(validationState.errors).length > 0 && (
        <div className="mb-3 p-2 bg-red-900/30 border border-red-700/50 rounded text-red-300 text-xs">
          {Object.entries(validationState.errors).map(([file, error]) => (
            <div key={file}>{file}: {error}</div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleShowUpdateModal}
          className="nodrag nopan flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          Update Asset
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const validImages = images || [];
            if (validImages.length > 0) {
              window.dispatchEvent(new CustomEvent('send-to-chat', { 
                detail: { images: validImages, name: assetName } 
              }));
            }
          }}
          className="nodrag nopan px-3 py-1.5 bg-gray-700 text-gray-200 text-sm rounded hover:bg-gray-600 transition-colors"
          title="Use images in Chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      {/* React Flow handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-500 !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 !w-3 !h-3"
      />
    </div>
  );
}

export default AssetNode;
