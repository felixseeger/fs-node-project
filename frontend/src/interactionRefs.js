/**
 * Shared interaction refs for the canvas.
 *
 * These are module-level refs (not React state) so child components
 * can read the current interaction state synchronously without triggering
 * re-renders. This prevents race conditions between hover updates,
 * selection changes, and viewport transforms.
 *
 * Usage in child components:
 *   import { isPanningRef, isDraggingNodeRef, isConnectingRef } from '../interactionRefs';
 *   if (isPanningRef.current) return; // skip hover update
 */

export const isPanningRef = { current: false };
export const isDraggingNodeRef = { current: false };
export const isConnectingRef = { current: false };

/**
 * Returns true if any canvas interaction is active.
 * Use this to suppress hover effects, tooltips, or other
 * transient UI during active manipulation.
 */
export function isCanvasInteracting() {
  return isPanningRef.current || isDraggingNodeRef.current || isConnectingRef.current;
}

/**
 * Adds or removes the 'canvas-interacting' class on <html>.
 * CSS can use this to globally suppress transitions/animations
 * during active canvas manipulation.
 */
let interactionCounter = 0;

export function beginInteraction() {
  interactionCounter++;
  document.documentElement.classList.add('canvas-interacting');
}

export function endInteraction() {
  interactionCounter = Math.max(0, interactionCounter - 1);
  if (interactionCounter === 0) {
    document.documentElement.classList.remove('canvas-interacting');
  }
}
