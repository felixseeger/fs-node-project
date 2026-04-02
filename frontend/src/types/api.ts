/**
 * API response and request types
 */

// Generic API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}

// Async task response
export interface AsyncTaskResponse {
  data: {
    id: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    result?: unknown;
  };
}

// Task status response
export interface TaskStatusResponse {
  data: {
    id: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    result?: {
      url?: string;
      urls?: string[];
      [key: string]: unknown;
    };
    error?: string;
  };
}

// Image generation request
export interface ImageGenerationRequest {
  prompt: string;
  image_url?: string;
  aspect_ratio?: string;
  resolution?: string;
  num_images?: number;
  [key: string]: unknown;
}

// Video generation request
export interface VideoGenerationRequest {
  prompt: string;
  image_url?: string;
  duration?: number | string;
  aspect_ratio?: string;
  [key: string]: unknown;
}

// Image editing request
export interface ImageEditingRequest {
  image_url: string;
  prompt?: string;
  [key: string]: unknown;
}

// Audio generation request
export interface AudioGenerationRequest {
  prompt: string;
  duration?: number;
  [key: string]: unknown;
}

// Vision analysis request
export interface VisionAnalysisRequest {
  images: Array<{
    type: 'base64' | 'url';
    source: string;
  }>;
  prompt: string;
  systemDirections?: string;
}

// Vision analysis response
export interface VisionAnalysisResponse {
  analysis: string;
}

// Handle data types for typed connections
export type HandleDataType = 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'text' 
  | 'aspect_ratio' 
  | 'resolution' 
  | 'num_images' 
  | 'any';

// Handle definition
export interface HandleDefinition {
  id: string;
  type: 'source' | 'target';
  dataType: HandleDataType;
  label?: string;
  required?: boolean;
}
