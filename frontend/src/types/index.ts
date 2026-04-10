/**
 * Type definitions for the AI Pipeline Editor
 */

export * from './global';
export * from './nodes';
export * from './workflow';
export * from './api';

// Re-export menu types
export interface NodeMenuSection {
  section: string;
  items: NodeMenuItem[];
}

export interface NodeMenuItem {
  type: string;
  label: string;
  defaults: Record<string, unknown>;
}
