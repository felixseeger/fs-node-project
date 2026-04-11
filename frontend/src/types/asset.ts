/**
 * Asset Types - Hardened type definitions for Asset creation and management
 * 
 * Provides strict typing, validation helpers, and runtime type guards
 * for the Asset creation system.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Supported asset media types
 */
export type AssetMediaType = 'image' | 'video' | 'audio' | 'document';

/**
 * Asset metadata for individual media items
 */
export interface AssetMediaItem {
  id: string;
  url: string;
  type: AssetMediaType;
  filename: string;
  mimeType: string;
  size?: number; // bytes
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // For video/audio (seconds)
  thumbnail?: string; // Base64 thumbnail for video
  createdAt: string;
}

/**
 * Asset status lifecycle
 */
export type AssetStatus = 'draft' | 'processing' | 'ready' | 'error' | 'archived';

/**
 * Core Asset interface - represents a reusable visual/media element
 */
export interface Asset {
  id: string;
  name: string;
  description?: string;
  userId: string;
  images: string[]; // Base64 data URLs or storage URLs (legacy support)
  mediaItems?: AssetMediaItem[]; // Structured media items (new)
  status: AssetStatus;
  tags?: string[];
  category?: string;
  isPublic?: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

/**
 * Asset creation payload - required fields for creating a new asset
 */
export interface CreateAssetPayload {
  name: string;
  description?: string;
  images: string[];
  tags?: string[];
  category?: string;
  isPublic?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Asset update payload - partial fields for updating an asset
 */
export type UpdateAssetPayload = Partial<Omit<CreateAssetPayload, 'images'>> & {
  images?: string[];
  status?: AssetStatus;
};

/**
 * Firestore asset document shape (before deserialization)
 */
export interface FirestoreAssetDocument {
  name: string;
  description?: string;
  userId: string;
  images: string[];
  mediaItems?: AssetMediaItem[];
  status: AssetStatus;
  tags?: string[];
  category?: string;
  isPublic?: boolean;
  isDeleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: Record<string, unknown>;
}

/**
 * Validation result for asset operations
 */
export interface AssetValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Asset service operation result
 */
export interface AssetOperationResult<T = Asset> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Maximum asset limits
 */
export const ASSET_LIMITS = {
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_IMAGES: 50,
  MAX_TAGS: 20,
  MAX_TAG_LENGTH: 30,
  MAX_METADATA_SIZE: 10000, // bytes (JSON stringified)
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
} as const;

/**
 * Validate asset name
 */
export function validateAssetName(name: unknown): string | null {
  if (typeof name !== 'string') {
    return 'Name must be a string';
  }
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return 'Name is required';
  }
  if (trimmed.length > ASSET_LIMITS.MAX_NAME_LENGTH) {
    return `Name must be ${ASSET_LIMITS.MAX_NAME_LENGTH} characters or less`;
  }
  // Check for invalid characters
  if (!/^[^<>{}\[\]]+$/.test(trimmed)) {
    return 'Name contains invalid characters';
  }
  return null;
}

/**
 * Validate asset description
 */
export function validateAssetDescription(description: unknown): string | null {
  if (description === undefined || description === null) {
    return null; // Optional
  }
  if (typeof description !== 'string') {
    return 'Description must be a string';
  }
  if (description.length > ASSET_LIMITS.MAX_DESCRIPTION_LENGTH) {
    return `Description must be ${ASSET_LIMITS.MAX_DESCRIPTION_LENGTH} characters or less`;
  }
  return null;
}

/**
 * Validate image array
 */
export function validateAssetImages(images: unknown): string | null {
  if (!Array.isArray(images)) {
    return 'Images must be an array';
  }
  if (images.length === 0) {
    return 'At least one image is required';
  }
  if (images.length > ASSET_LIMITS.MAX_IMAGES) {
    return `Maximum ${ASSET_LIMITS.MAX_IMAGES} images allowed`;
  }
  // Validate each image is a non-empty string
  for (let i = 0; i < images.length; i++) {
    if (typeof images[i] !== 'string' || images[i].length === 0) {
      return `Image at index ${i} is invalid`;
    }
    // Check if it's a valid data URL or http URL
    const img = images[i] as string;
    if (!img.startsWith('data:') && !img.startsWith('http')) {
      return `Image at index ${i} must be a data URL or http URL`;
    }
  }
  return null;
}

/**
 * Validate tags array
 */
export function validateAssetTags(tags: unknown): string | null {
  if (tags === undefined || tags === null) {
    return null; // Optional
  }
  if (!Array.isArray(tags)) {
    return 'Tags must be an array';
  }
  if (tags.length > ASSET_LIMITS.MAX_TAGS) {
    return `Maximum ${ASSET_LIMITS.MAX_TAGS} tags allowed`;
  }
  for (let i = 0; i < tags.length; i++) {
    if (typeof tags[i] !== 'string') {
      return `Tag at index ${i} must be a string`;
    }
    if (tags[i].length > ASSET_LIMITS.MAX_TAG_LENGTH) {
      return `Tag at index ${i} exceeds ${ASSET_LIMITS.MAX_TAG_LENGTH} characters`;
    }
  }
  return null;
}

/**
 * Validate metadata object
 */
export function validateAssetMetadata(metadata: unknown): string | null {
  if (metadata === undefined || metadata === null) {
    return null; // Optional
  }
  if (typeof metadata !== 'object' || metadata === null) {
    return 'Metadata must be an object';
  }
  try {
    const size = JSON.stringify(metadata).length;
    if (size > ASSET_LIMITS.MAX_METADATA_SIZE) {
      return `Metadata exceeds maximum size of ${ASSET_LIMITS.MAX_METADATA_SIZE} bytes`;
    }
  } catch {
    return 'Metadata is not serializable';
  }
  return null;
}

/**
 * Validate complete asset payload for creation
 */
export function validateCreateAssetPayload(payload: unknown): AssetValidationResult {
  const errors: string[] = [];
  
  if (typeof payload !== 'object' || payload === null) {
    return { valid: false, errors: ['Payload must be an object'] };
  }
  
  const p = payload as Record<string, unknown>;
  
  // Validate required fields
  const nameError = validateAssetName(p.name);
  if (nameError) errors.push(nameError);
  
  const imagesError = validateAssetImages(p.images);
  if (imagesError) errors.push(imagesError);
  
  // Validate optional fields
  const descriptionError = validateAssetDescription(p.description);
  if (descriptionError) errors.push(descriptionError);
  
  const tagsError = validateAssetTags(p.tags);
  if (tagsError) errors.push(tagsError);
  
  const metadataError = validateAssetMetadata(p.metadata);
  if (metadataError) errors.push(metadataError);
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Type guard: Check if value is a valid Asset
 */
export function isAsset(value: unknown): value is Asset {
  if (typeof value !== 'object' || value === null) return false;
  const a = value as Record<string, unknown>;
  
  return (
    typeof a.id === 'string' &&
    typeof a.name === 'string' &&
    typeof a.userId === 'string' &&
    Array.isArray(a.images) &&
    typeof a.isDeleted === 'boolean' &&
    typeof a.createdAt === 'string' &&
    typeof a.updatedAt === 'string' &&
    (a.status === undefined || ['draft', 'processing', 'ready', 'error', 'archived'].includes(a.status as string))
  );
}

/**
 * Type guard: Check if value is a valid Asset array
 */
export function isAssetArray(value: unknown): value is Asset[] {
  return Array.isArray(value) && value.every(isAsset);
}

/**
 * Sanitize asset name for storage
 */
export function sanitizeAssetName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/[<>{}/[\]]/g, '') // Remove dangerous characters
    .slice(0, ASSET_LIMITS.MAX_NAME_LENGTH);
}

/**
 * Create a valid asset object from partial data
 */
export function createAssetObject(
  id: string,
  userId: string,
  payload: CreateAssetPayload
): Asset {
  const now = new Date().toISOString();
  
  return {
    id,
    name: sanitizeAssetName(payload.name),
    description: payload.description?.trim(),
    userId,
    images: payload.images,
    status: 'ready',
    tags: payload.tags?.map(t => t.trim().toLowerCase()),
    category: payload.category?.trim(),
    isPublic: payload.isPublic ?? false,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    metadata: payload.metadata,
  };
}
