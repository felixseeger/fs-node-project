/**
 * AssetModal - Hardened modal for creating Asset elements
 * 
 * Features:
 * - Strict prop typing
 * - Input validation
 * - Loading state handling
 * - Error display
 */

import React, { useState, useCallback, useEffect } from 'react';
import { CreateAssetPayload, validateCreateAssetPayload } from './types/asset';
import { AssetOperationResult, Asset } from './types/asset';

/**
 * Modal mode for different asset creation scenarios
 */
export type AssetModalMode = 'standalone' | 'workflow';

/**
 * AssetModal props with strict typing
 */
export interface AssetModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback for workflow mode - adds node to workflow */
  onAddToWorkflow?: (assetData: Asset) => void;
  /** Callback for standalone mode - creates and returns asset */
  onCreateAsset?: (payload: CreateAssetPayload) => Promise<AssetOperationResult<Asset>>;
  /** Modal mode - standalone or workflow integration */
  mode?: AssetModalMode;
  /** User ID for asset ownership */
  userId?: string;
}

/**
 * Image preview with metadata
 */
interface ImagePreview {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Modal state
 */
interface ModalState {
  name: string;
  description: string;
  tags: string;
  isLoading: boolean;
  error: string | null;
  images: ImagePreview[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Asset Modal Component
 * 
 * Supports two modes:
 * - 'standalone': Creates asset via onCreateAsset callback
 * - 'workflow': Creates asset and adds to workflow via onAddToWorkflow
 */
export function AssetModal({
  isOpen,
  onClose,
  onAddToWorkflow,
  onCreateAsset,
  mode = 'standalone',
  userId,
}: AssetModalProps): React.ReactElement | null {
  const [state, setState] = useState<ModalState>({
    name: '',
    description: '',
    tags: '',
    isLoading: false,
    error: null,
    images: [],
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setState({
        name: '',
        description: '',
        tags: '',
        isLoading: false,
        error: null,
        images: [],
      });
    }
  }, [isOpen]);

  /**
   * Validate and process file selection
   */
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Allowed: JPG, PNG, WebP, GIF`);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
        return;
      }

      // Convert to data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const preview: ImagePreview = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: result,
            name: file.name,
            size: file.size,
            type: file.type,
          };
          
          setState(prev => ({
            ...prev,
            images: [...prev.images, preview],
            error: null,
          }));
        }
      };
      reader.onerror = () => {
        errors.push(`${file.name}: Failed to read file`);
      };
      reader.readAsDataURL(file);
    });

    if (errors.length > 0) {
      setState(prev => ({
        ...prev,
        error: errors.join('; '),
      }));
    }
  }, []);

  /**
   * Remove an image from the preview
   */
  const removeImage = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id),
    }));
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate we have images
    if (state.images.length === 0) {
      setState(prev => ({ ...prev, error: 'Please select at least one image' }));
      return;
    }

    // Validate name
    if (!state.name.trim()) {
      setState(prev => ({ ...prev, error: 'Name is required' }));
      return;
    }

    // Build payload
    const payload: CreateAssetPayload = {
      name: state.name.trim(),
      description: state.description.trim() || undefined,
      images: state.images.map(img => img.url),
      tags: state.tags
        ? state.tags.split(',').map(t => t.trim()).filter(Boolean)
        : undefined,
    };

    // Validate payload
    const validation = validateCreateAssetPayload(payload);
    if (!validation.valid) {
      setState(prev => ({ 
        ...prev, 
        error: validation.errors.join('; '),
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (mode === 'workflow' && onAddToWorkflow) {
        // Workflow mode - create temp asset and add to workflow
        // In real implementation, this would create via API first
        const tempAsset: Asset = {
          id: `temp-${Date.now()}`,
          userId: userId || '',
          ...payload,
          status: 'draft',
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        onAddToWorkflow(tempAsset);
        onClose();
      } else if (onCreateAsset) {
        // Standalone mode - create via service
        const result = await onCreateAsset(payload);
        
        if (result.success && result.data) {
          onClose();
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: result.error || 'Failed to create asset',
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No handler provided for this mode',
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      }));
    }
  }, [state, mode, onAddToWorkflow, onCreateAsset, onClose, userId]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="asset-modal-title"
    >
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 id="asset-modal-title" className="text-xl font-semibold text-white">
            {mode === 'workflow' ? 'Add Asset to Workflow' : 'Create New Asset'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
            disabled={state.isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
            {state.error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="asset-name" className="block text-sm font-medium text-gray-300 mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="asset-name"
              type="text"
              value={state.name}
              onChange={(e) => setState(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              placeholder="Enter asset name"
              maxLength={100}
              disabled={state.isLoading}
              required
            />
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label htmlFor="asset-description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="asset-description"
              value={state.description}
              onChange={(e) => setState(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              placeholder="Optional description"
              rows={3}
              maxLength={500}
              disabled={state.isLoading}
            />
          </div>

          {/* Tags Input */}
          <div className="mb-4">
            <label htmlFor="asset-tags" className="block text-sm font-medium text-gray-300 mb-1">
              Tags
            </label>
            <input
              id="asset-tags"
              type="text"
              value={state.tags}
              onChange={(e) => setState(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              placeholder="tag1, tag2, tag3"
              disabled={state.isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Images <span className="text-red-400">*</span>
            </label>
            
            {/* Drop Zone */}
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelect(e.dataTransfer.files);
              }}
            >
              <input
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="image-upload"
                disabled={state.isLoading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-blue-400 hover:text-blue-300"
              >
                Click to upload
              </label>
              <span className="text-gray-400"> or drag and drop</span>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG, WebP, GIF up to {MAX_FILE_SIZE / 1024 / 1024}MB
              </p>
            </div>

            {/* Image Previews */}
            {state.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {state.images.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={state.isLoading}
                      aria-label={`Remove ${img.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              disabled={state.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={state.isLoading || state.images.length === 0 || !state.name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {state.isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </>
              ) : (
                mode === 'workflow' ? 'Add to Workflow' : 'Create Asset'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssetModal;
