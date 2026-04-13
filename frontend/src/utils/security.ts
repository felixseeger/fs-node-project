/**
 * Security utilities for the AI Pipeline Editor
 * Provides input sanitization, validation, and safe processing functions
 * to prevent XSS, code injection, and other security vulnerabilities.
 */

import { type Workflow } from '../types/workflow';

// =============================================================================
// VALIDATION ERROR TYPES
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface SanitizedResult<T> {
  data: T;
  wasSanitized: boolean;
  issues: string[];
}

// =============================================================================
// XSS PREVENTION - TEXT SANITIZATION
// =============================================================================

/**
 * HTML entity encoder for XSS prevention
 * Encodes special characters that could be interpreted as HTML/JS
 */
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
  '{': '&#123;',
  '}': '&#125;',
  '\\': '&#92;'
};

/**
 * Sanitize text input to prevent XSS
 * Replaces dangerous characters with HTML entities
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input.replace(/[&<>"'\/=`{}\\]/g, (char) => htmlEntities[char] || char);
}

/**
 * Validate and sanitize annotation text
 * Returns sanitized text or null if invalid
 */
export function validateAnnotationText(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  
  const trimmed = input.trim();
  
  // Check length limits
  if (trimmed.length === 0) return null;
  if (trimmed.length > 500) {
    console.warn('Annotation text exceeds maximum length of 500 characters');
    return trimmed.substring(0, 500);
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi
  ];
  
  let sanitized = trimmed;
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      sanitized = sanitized.replace(pattern, '[removed]');
      console.warn('Potentially dangerous content detected and removed from annotation');
    }
  }
  
  // Apply HTML entity encoding
  return sanitizeText(sanitized);
}

// =============================================================================
// WORKFLOW JSON VALIDATION
// =============================================================================

/**
 * JSON Schema for workflow validation
 * Ensures imported workflows have valid structure and safe content
 */
const WORKFLOW_SCHEMA = {
  requiredFields: ['nodes'],
  allowedFields: ['nodes', 'edges', 'metadata', 'version'],
  maxNodes: 1000,
  maxEdges: 2000,
  maxNodeLabelLength: 200,
  maxDescriptionLength: 5000
};

/**
 * Validate a workflow node structure
 */
function validateNode(node: unknown, index: number): ValidationResult {
  const errors: string[] = [];
  
  if (!node || typeof node !== 'object') {
    return { valid: false, errors: [`Node ${index} is not an object`] };
  }
  
  const nodeObj = node as Record<string, unknown>;
  
  // Required fields
  if (typeof nodeObj.id !== 'string') {
    errors.push(`Node ${index}: missing or invalid 'id'`);
  }
  
  if (typeof nodeObj.type !== 'string') {
    errors.push(`Node ${index}: missing or invalid 'type'`);
  }
  
  if (typeof nodeObj.label !== 'string') {
    errors.push(`Node ${index}: missing or invalid 'label'`);
  } else if (nodeObj.label.length > WORKFLOW_SCHEMA.maxNodeLabelLength) {
    errors.push(`Node ${index}: label exceeds maximum length`);
  }
  
  // Validate position
  if (nodeObj.position === undefined || nodeObj.position === null) {
    errors.push(`Node ${index}: missing 'position'`);
  } else if (typeof nodeObj.position !== 'object') {
    errors.push(`Node ${index}: 'position' must be an object`);
  } else {
    const pos = nodeObj.position as Record<string, unknown>;
    if (typeof pos.x !== 'number' || Number.isNaN(pos.x)) {
      errors.push(`Node ${index}: 'position.x' must be a valid number`);
    }
    if (typeof pos.y !== 'number' || Number.isNaN(pos.y)) {
      errors.push(`Node ${index}: 'position.y' must be a valid number`);
    }
  }
  
  // Check for dangerous properties
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  const nodeKeys = Object.keys(nodeObj);
  for (const key of dangerousKeys) {
    if (nodeKeys.includes(key)) {
      errors.push(`Node ${index}: contains forbidden property '${key}'`);
    }
  }
  
  // Validate data property if present
  if (nodeObj.data !== undefined && nodeObj.data !== null) {
    if (typeof nodeObj.data !== 'object') {
      errors.push(`Node ${index}: 'data' must be an object`);
    } else {
      // Check data properties for suspicious values
      const dataStr = JSON.stringify(nodeObj.data);
      if (/<script/i.test(dataStr) || /javascript:/i.test(dataStr)) {
        errors.push(`Node ${index}: data contains suspicious content`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate a workflow edge structure
 */
function validateEdge(edge: unknown, index: number): ValidationResult {
  const errors: string[] = [];
  
  if (!edge || typeof edge !== 'object') {
    return { valid: false, errors: [`Edge ${index} is not an object`] };
  }
  
  const edgeObj = edge as Record<string, unknown>;
  
  // Required fields
  if (typeof edgeObj.id !== 'string') {
    errors.push(`Edge ${index}: missing or invalid 'id'`);
  }
  
  if (typeof edgeObj.source !== 'string') {
    errors.push(`Edge ${index}: missing or invalid 'source'`);
  }
  
  if (typeof edgeObj.target !== 'string') {
    errors.push(`Edge ${index}: missing or invalid 'target'`);
  }
  
  // Optional fields validation
  if (edgeObj.label && typeof edgeObj.label !== 'string') {
    errors.push(`Edge ${index}: 'label' must be a string`);
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate a complete workflow object
 * Use before importing workflows from external sources (AI responses, files, etc.)
 */
export function validateWorkflow(workflow: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!workflow || typeof workflow !== 'object') {
    return { valid: false, errors: ['Workflow must be an object'] };
  }
  
  const wf = workflow as Record<string, unknown>;
  
  // Check required fields
  for (const field of WORKFLOW_SCHEMA.requiredFields) {
    if (!(field in wf)) {
      errors.push(`Missing required field: '${field}'`);
    }
  }
  
  // Check for unknown fields
  const unknownFields = Object.keys(wf).filter(
    key => !WORKFLOW_SCHEMA.allowedFields.includes(key)
  );
  if (unknownFields.length > 0) {
    console.warn('Workflow contains unknown fields:', unknownFields);
  }
  
  // Validate nodes
  if (!Array.isArray(wf.nodes)) {
    errors.push("'nodes' must be an array");
  } else {
    if (wf.nodes.length > WORKFLOW_SCHEMA.maxNodes) {
      errors.push(`Too many nodes (max ${WORKFLOW_SCHEMA.maxNodes})`);
    }
    
    const nodeIds = new Set<string>();
    for (let i = 0; i < wf.nodes.length; i++) {
      const nodeValidation = validateNode(wf.nodes[i], i);
      if (!nodeValidation.valid) {
        errors.push(...nodeValidation.errors);
      }
      
      // Check for duplicate IDs
      const node = wf.nodes[i] as { id?: string };
      if (node.id) {
        if (nodeIds.has(node.id)) {
          errors.push(`Duplicate node ID: '${node.id}'`);
        }
        nodeIds.add(node.id);
      }
    }
  }
  
  // Validate edges if present
  if (wf.edges !== undefined) {
    if (!Array.isArray(wf.edges)) {
      errors.push("'edges' must be an array");
    } else {
      if (wf.edges.length > WORKFLOW_SCHEMA.maxEdges) {
        errors.push(`Too many edges (max ${WORKFLOW_SCHEMA.maxEdges})`);
      }
      
      for (let i = 0; i < wf.edges.length; i++) {
        const edgeValidation = validateEdge(wf.edges[i], i);
        if (!edgeValidation.valid) {
          errors.push(...edgeValidation.errors);
        }
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Safe JSON parser with workflow validation
 * Use instead of JSON.parse when parsing workflow data from untrusted sources
 */
export function parseWorkflowJSON(jsonString: string): {
  success: boolean;
  workflow?: Workflow;
  error?: string;
  validationErrors?: string[];
} {
  try {
    // First, attempt to parse the JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      return {
        success: false,
        error: `Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
      };
    }
    
    // Validate the structure
    const validation = validateWorkflow(parsed);
    if (!validation.valid) {
      return {
        success: false,
        error: 'Workflow validation failed',
        validationErrors: validation.errors
      };
    }
    
    return {
      success: true,
      workflow: parsed as Workflow
    };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Extract and validate workflow from AI response content
 * Handles markdown code blocks and validates before returning
 */
export function extractWorkflowFromContent(content: string): {
  success: boolean;
  workflow?: Workflow;
  error?: string;
} {
  // Match JSON code blocks
  const jsonRegex = /```(?:json)?\n([\s\S]*?)\n```/g;
  const matches: string[] = [];
  let match: RegExpExecArray | null;
  
  while ((match = jsonRegex.exec(content)) !== null) {
    if (match[1]) {
      matches.push(match[1]);
    }
  }
  
  if (matches.length === 0) {
    return { success: false, error: 'No workflow JSON found in content' };
  }
  
  // Try each match until one validates
  for (const jsonContent of matches) {
    const result = parseWorkflowJSON(jsonContent);
    if (result.success && result.workflow) {
      return {
        success: true,
        workflow: result.workflow
      };
    }
  }
  
  return { success: false, error: 'Found JSON blocks but none contain valid workflow data' };
}

// =============================================================================
// FILE INPUT VALIDATION
// =============================================================================

/**
 * Allowed image MIME types for file uploads
 */
const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

/**
 * Maximum file size for uploads (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  mimeType?: string;
}

/**
 * Validate image file for upload
 * Performs MIME type validation and file size checks
 */
export function validateImageFile(file: File): FileValidationResult {
  // Check file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    };
  }
  
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${formatBytes(MAX_FILE_SIZE)}`
    };
  }
  
  // Validate file size is not zero
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  
  return { valid: true, mimeType: file.type };
}

/**
 * Validate file by reading magic bytes to verify actual content
 * Returns a promise that resolves with validation result
 */
export function validateImageByContent(file: File): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (!(result instanceof ArrayBuffer)) {
        resolve({ valid: false, error: 'Could not read file content' });
        return;
      }
      
      const bytes = new Uint8Array(result);
      
      // Check magic bytes for common image formats
      const magicBytes: Record<string, number[]> = {
        'image/png': [0x89, 0x50, 0x4E, 0x47],
        'image/jpeg': [0xFF, 0xD8, 0xFF],
        'image/gif': [0x47, 0x49, 0x46, 0x38],
        'image/webp': [0x52, 0x49, 0x46, 0x46] // RIFF header
      };
      
      // Check file signature
      for (const [mimeType, signature] of Object.entries(magicBytes)) {
        if (bytes.length >= signature.length) {
          const matches = signature.every((byte, i) => bytes[i] === byte);
          if (matches) {
            // File signature matches, but also verify declared MIME type
            if (file.type !== mimeType && file.type !== '') {
              console.warn(`File MIME type mismatch: declared ${file.type}, actual ${mimeType}`);
            }
            resolve({ valid: true, mimeType });
            return;
          }
        }
      }
      
      // SVG files don't have magic bytes, check for XML signature
      if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        const textContent = new TextDecoder().decode(bytes.slice(0, 100));
        if (textContent.includes('<svg') || textContent.includes('<?xml')) {
          resolve({ valid: true, mimeType: 'image/svg+xml' });
          return;
        }
      }
      
      resolve({ valid: false, error: 'File content does not match expected image format' });
    };
    
    reader.onerror = () => {
      resolve({ valid: false, error: 'Error reading file' });
    };
    
    // Read first 8 bytes for magic number detection
    reader.readAsArrayBuffer(file.slice(0, 8));
  });
}

// =============================================================================
// URL VALIDATION
// =============================================================================

/**
 * Validate image URL to prevent loading malicious content
 */
export function validateImageUrl(url: string): ValidationResult {
  const errors: string[] = [];
  
  if (typeof url !== 'string') {
    return { valid: false, errors: ['URL must be a string'] };
  }
  
  // Check for data URIs - only allow image data URIs
  if (url.startsWith('data:')) {
    const allowedDataTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
    const isAllowed = allowedDataTypes.some(type => url.startsWith(`data:${type}`));
    
    if (!isAllowed) {
      errors.push('Data URI must be of type image/*');
    }
    
    // Check for XSS attempts in data URIs
    if (/data:text\/html/i.test(url)) {
      errors.push('HTML data URIs are not allowed');
    }
    
    return { valid: errors.length === 0, errors };
  }
  
  // Try to parse as URL
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, errors: ['Invalid URL format'] };
  }
  
  // Only allow http and https protocols
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    errors.push('Only HTTP and HTTPS URLs are allowed');
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /javascript:/i,
    /vbscript:/i,
    /on\w+=/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      errors.push('URL contains suspicious patterns');
      break;
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// =============================================================================
// SPEECH RECOGNITION SECURITY
// =============================================================================

/**
 * Speech Recognition interface for browsers that support it
 */
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

/**
 * Check if SpeechRecognition API is available and safe to use
 */
export function isSpeechRecognitionAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Safely create a SpeechRecognition instance with error handling
 */
export function createSpeechRecognition(): SpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  
  const SpeechRecognitionAPI = ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  
  if (!SpeechRecognitionAPI) {
    return null;
  }
  
  try {
    const recognition = new SpeechRecognitionAPI() as SpeechRecognition;
    
    // Set safe defaults
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    return recognition;
  } catch (error) {
    console.error('Failed to create SpeechRecognition:', error);
    return null;
  }
}

/**
 * Sanitize speech recognition transcript
 * Removes potentially dangerous characters from voice input
 */
export function sanitizeSpeechInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove control characters and potential script injection attempts
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .substring(0, 1000); // Limit length
}

// =============================================================================
// CANVAS SECURITY
// =============================================================================

/**
 * Sanitize data URL output from canvas
 * Ensures only image data URLs are returned
 */
export function sanitizeCanvasDataUrl(dataUrl: string): string | null {
  if (typeof dataUrl !== 'string') return null;
  
  // Only allow image data URLs
  const allowedPrefixes = [
    'data:image/png;base64,',
    'data:image/jpeg;base64,',
    'data:image/webp;base64,'
  ];
  
  const isValid = allowedPrefixes.some(prefix => dataUrl.startsWith(prefix));
  
  if (!isValid) {
    console.error('Invalid data URL format');
    return null;
  }
  
  // Check for reasonable size (10MB base64 encoded)
  const maxLength = 14 * 1024 * 1024; // ~10MB when decoded
  if (dataUrl.length > maxLength) {
    console.error('Data URL exceeds maximum size');
    return null;
  }
  
  return dataUrl;
}

// =============================================================================
// FORMAT UTILITIES (helper functions)
// =============================================================================

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  sanitizeText,
  validateAnnotationText,
  validateWorkflow,
  parseWorkflowJSON,
  extractWorkflowFromContent,
  validateImageFile,
  validateImageByContent,
  validateImageUrl,
  isSpeechRecognitionAvailable,
  createSpeechRecognition,
  sanitizeSpeechInput,
  sanitizeCanvasDataUrl
};
