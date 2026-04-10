/**
 * BaseNode Component - Foundation for all workflow nodes
 * 
 * Inspired by NodeBanana's BaseNode but adapted for FS Node Project's architecture.
 * Provides core functionality for all 63+ node types including:
 * - Resizing with aspect ratio preservation
 * - Execution state management
 * - Settings panel animation
 * - Accessibility compliance
 * - Performance optimization
 */

"use client";

import React, { ReactNode, useCallback, useRef, useLayoutEffect, useState, useEffect } from "react";
import { Node, NodeResizer, OnResize, useReactFlow } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { getMediaDimensions } from "@/utils/nodeDimensions";
import { BaseNodeData, NodeStatus } from "@/types/nodes";

// Constants
const DEFAULT_NODE_DIMENSION = 300;
const MIN_NODE_WIDTH = 180;
const MIN_NODE_HEIGHT = 100;
const ANIMATION_DURATION = 160; // ms

interface BaseNodeProps<T extends BaseNodeData = BaseNodeData> {
  id: string;
  children: ReactNode;
  selected?: boolean;
  hasError?: boolean;
  className?: string;
  contentClassName?: string;
  minWidth?: number;
  minHeight?: number;
  /** When true, node has no background/border — content fills entire area */
  fullBleed?: boolean;
  /** Media URL (image/video) to use for aspect-fit resize on resize-handle double-click */
  aspectFitMedia?: string | null;
  /** When true, bottom corners lose rounding so selection ring connects to settings panel */
  settingsExpanded?: boolean;
  /** Settings panel rendered outside the bordered area, shares node's full width */
  settingsPanel?: ReactNode;
  /** Optional header component */
  header?: ReactNode;
  /** Optional footer component */
  footer?: ReactNode;
  /** Node data for type safety */
  data: T;
  /** Execution status */
  status?: NodeStatus;
}

/**
 * Read a node's effective width or height, respecting React Flow's internal priority
 */
function getNodeDimension(node: Node, axis: "width" | "height"): number {
  return (
    (node[axis] as number) ??
    (node.style?.[axis] as number) ??
    (node.measured?.[axis] as number) ??
    DEFAULT_NODE_DIMENSION
  );
}

/**
 * Apply dimensions to a React Flow node
 */
function applyNodeDimensions(node: Node, width: number, height: number): Node {
  return {
    ...node,
    width,
    height,
    style: { ...node.style, width, height },
  };
}

/**
 * BaseNode Component - Foundation for all workflow nodes
 */
export function BaseNode<T extends BaseNodeData = BaseNodeData>({
  id,
  children,
  selected = false,
  hasError = false,
  className = "",
  contentClassName,
  minWidth = MIN_NODE_WIDTH,
  minHeight = MIN_NODE_HEIGHT,
  fullBleed = false,
  aspectFitMedia,
  settingsExpanded = false,
  settingsPanel,
  header,
  footer,
  data,
  status = "idle",
}: BaseNodeProps<T>) {
  const { getNodes, setNodes } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const [, setIsResizing] = useState(false);
  const [, setMediaDimensions] = useState<{
    width: number;
    height: number;
    aspectRatio: number;
  } | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const trackedSettingsHeightRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Get current node from React Flow (must not early-return before hooks)
  const node = getNodes().find(n => n.id === id);
  const currentWidth = node ? getNodeDimension(node, "width") : minWidth;
  const currentHeight = node ? getNodeDimension(node, "height") : minHeight;
  
  // Load media dimensions if aspectFitMedia provided
  useEffect(() => {
    if (aspectFitMedia) {
      getMediaDimensions(aspectFitMedia)
        .then(dims => setMediaDimensions(dims))
        .catch(error => {
          console.warn(`Could not load media dimensions for ${aspectFitMedia}:`, error);
        });
    }
  }, [aspectFitMedia]);
  
  // Handle resize events
  const onResize: OnResize = useCallback((_event, { width, height }) => {
    setNodes((nodes) => 
      nodes.map((n) => 
        n.id === id 
          ? applyNodeDimensions(n, Math.max(minWidth, width), Math.max(minHeight, height))
          : n
      )
    );
  }, [id, minWidth, minHeight, setNodes]);
  
  const onResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  const onResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Adjust node height when settings expand or collapse
  useLayoutEffect(() => {
    if (!node) return;
    // Cancel any pending animation timeout from previous toggle
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    const contentEl = contentRef.current;
    const ANIMATION_MS = ANIMATION_DURATION;
    
    if (!settingsExpanded && trackedSettingsHeightRef.current > 0) {
      // COLLAPSE
      const heightToRemove = trackedSettingsHeightRef.current;
      trackedSettingsHeightRef.current = 0;
      isAnimatingRef.current = true;
      
      // Lock content height for animation
      if (contentEl) {
        contentEl.style.height = `${contentEl.offsetHeight}px`;
      }
      
      setNodes((nodes) => 
        nodes.map((n) => 
          n.id !== id ? n : {
            ...applyNodeDimensions(n, getNodeDimension(n, "width"), Math.max(minHeight, currentHeight - heightToRemove)),
            data: { ...n.data, _settingsPanelHeight: 0 }
          }
        )
      );
      
      animationTimeoutRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
        if (contentEl) contentEl.style.height = "";
      }, ANIMATION_MS);
      
    } else if (settingsExpanded && settingsPanel) {
      // EXPAND
      isAnimatingRef.current = true;
      
      // Lock content wrapper during animation
      if (contentEl) {
        const wrapperEl = contentEl.parentElement as HTMLElement | null;
        if (wrapperEl) {
          wrapperEl.style.flex = "none";
          wrapperEl.style.height = `${wrapperEl.offsetHeight}px`;
        }
      }
      
      animationTimeoutRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
        
        // Apply final panel height
        const finalHeight = trackedSettingsHeightRef.current;
        if (finalHeight > 0) {
          const savedPanelHeight = typeof (node.data as Record<string, unknown>)?._settingsPanelHeight === "number"
            ? (node.data as Record<string, unknown>)._settingsPanelHeight as number
            : 0;
          
          setNodes((nodes) => 
            nodes.map((n) => 
              n.id !== id ? n : {
                ...applyNodeDimensions(n, getNodeDimension(n, "width"), currentHeight + (finalHeight - savedPanelHeight)),
                data: { ...n.data, _settingsPanelHeight: finalHeight }
              }
            )
          );
        }
        
        // Unlock wrapper
        if (contentEl) {
          const wrapperEl = contentEl.parentElement as HTMLElement | null;
          if (wrapperEl) {
            wrapperEl.style.flex = "";
            wrapperEl.style.height = "";
          }
        }
      }, ANIMATION_MS);
    }
  }, [settingsExpanded, minHeight, currentHeight, setNodes, id, node, minWidth]);
  
  // Track settings panel height
  useEffect(() => {
    if (!settingsPanelRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        trackedSettingsHeightRef.current = entry.contentRect.height;
      }
    });
    
    observer.observe(settingsPanelRef.current);
    return () => observer.disconnect();
  }, [settingsPanel]);
  
  // Execution status styles
  const getStatusStyles = useCallback((): string => {
    switch (status) {
      case "loading":
        return "animate-pulse border-blue-500/50";
      case "complete":
        return "border-green-500/50";
      case "error":
        return "border-red-500/50 animate-shake";
      case "skipped":
        return "border-gray-500/50 opacity-70";
      case "paused":
        return "border-yellow-500/50";
      default:
        return "";
    }
  }, [status]);
  
  // Execution indicator
  const ExecutionIndicator = useCallback(() => {
    switch (status) {
      case "loading":
        return (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        );
      case "error":
        return (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        );
      case "complete":
        return (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        );
      default:
        return null;
    }
  }, [status]);

  if (!node) {
    console.warn(`BaseNode: Node with id ${id} not found in React Flow`);
    return null;
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-node-background border border-node-border rounded-lg overflow-hidden",
        {
          "border-2": selected || isHovered,
          "border-blue-500": selected,
          "border-gray-600": isHovered && !selected,
          "shadow-lg": selected,
          "shadow-md": isHovered && !selected,
        },
        getStatusStyles(),
        className || ''
      )}
      style={{
        width: currentWidth,
        height: currentHeight,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${data.label} node`}
      aria-describedby={hasError ? `${id}-error` : undefined}
      role="article"
    >
      {/* Execution Indicator */}
      <ExecutionIndicator />
      
      {/* Header (if provided) */}
      {header && (
        <div className="px-3 py-2 bg-node-header border-b border-node-border flex items-center justify-between">
          {header}
        </div>
      )}
      
      {/* Main Content */}
      <div
        ref={contentRef}
        className={cn(
          "flex-1 min-h-0 overflow-hidden",
          {
            "p-3": !fullBleed,
            "flex flex-col": true,
          },
          contentClassName || ''
        )}
        style={{
          // Lock height during settings panel animation
          height: isAnimatingRef.current ? `${contentRef.current?.offsetHeight || currentHeight - (minHeight + (settingsExpanded ? trackedSettingsHeightRef.current : 0))}px` : "auto"
        }}
      >
        {children}
      </div>
      
      {/* Footer (if provided) */}
      {footer && (
        <div className="px-3 py-2 bg-node-header border-t border-node-border">
          {footer}
        </div>
      )}
      
      {/* Settings Panel */}
      <AnimatePresence>
        {settingsExpanded && settingsPanel && (
          <motion.div
            ref={settingsPanelRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION / 1000, ease: "easeInOut" }}
            className="overflow-hidden border-t border-node-border bg-node-settings"
          >
            {settingsPanel}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Resize Handle */}
      <NodeResizer
        minWidth={minWidth}
        minHeight={minHeight}
        isVisible={selected || isHovered}
        lineClassName="border-node-resize-handle"
        handleClassName="w-3 h-3 bg-node-resize-handle rounded-sm"
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      />
      
      {/* Error Message */}
      {hasError && data.error && (
        <div
          id={`${id}-error`}
          className="absolute bottom-0 left-0 right-0 bg-red-900/80 text-red-100 p-2 text-xs border-t border-red-700"
          role="alert"
          aria-live="assertive"
        >
          {data.error}
        </div>
      )}
      
      {/* Accessibility: Focus indicator */}
      <div
        className="absolute inset-0 pointer-events-none rounded-lg"
        aria-hidden="true"
      >
        <div className={cn(
          "absolute inset-0 border-2 border-transparent rounded-lg transition-all duration-200",
          selected ? "border-blue-500" : isHovered ? "border-gray-500" : ""
        )} />
      </div>
    </div>
  );
}

/**
 * Memoized BaseNode for better performance
 */
export const MemoizedBaseNode = React.memo(BaseNode) as typeof BaseNode;

/**
 * Type-safe wrapper for specific node types
 */
export function createTypedBaseNode<T extends BaseNodeData>(
  specificProps: Omit<BaseNodeProps<T>, 'data' | 'status'> & {
    data: T;
    status?: NodeStatus;
  }
) {
  return <BaseNode<T> {...specificProps} />;
}
