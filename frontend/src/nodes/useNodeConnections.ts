import { useCallback, useMemo, useRef } from 'react';
import { useReactFlow, type Node, type Edge } from '@xyflow/react';
import { isHandleConnected, getConnectionInfo as getConnectionInfoBase, resolveInput as resolveInputBase } from '../helpers/nodeData';
import type { NodeData } from '../types';

interface NodeConnectionHandlers {
  onUpdate?: (nodeId: string, patch: Record<string, any>) => void;
  getConnectionInfo?: (nodeId: string, handleId: string) => any;
  hasConnection?: (nodeId: string, handleId: string) => boolean;
  resolveInput?: (nodeId: string, handleId: string) => any;
  onUnlink?: (nodeId: string, handleId: string) => void;
  onDisconnectNode?: (nodeId: string) => void;
}

export default function useNodeConnections(id: string, data: NodeConnectionHandlers) {
  const { setNodes, setEdges, getEdges, getNodes } = useReactFlow();

  const dataRef = useRef(data);
  dataRef.current = data;

  const update = useCallback(
    (patch: Record<string, any>) => {
      // Primary fallback to context/loader provided onUpdate
      if (dataRef.current?.onUpdate) {
        dataRef.current.onUpdate(id, patch);
        return;
      }
      // Ultimate fallback: direct react flow setNodes
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...patch } } : n
        )
      );
      // Dispatch dirty event to trigger autosave in App.tsx
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('canvas-dirty'));
      }
    },
    [id, setNodes]
  );

  const getConnInfo = useCallback(
    (handleId: string) => {
      if (dataRef.current?.getConnectionInfo) return dataRef.current.getConnectionInfo(id, handleId);
      return getConnectionInfoBase(id, handleId, getEdges(), getNodes() as Node<NodeData>[]);
    },
    [id, getEdges, getNodes]
  );

  const hasConnection = useCallback(
    (handleId: string) => {
      if (dataRef.current?.hasConnection) return dataRef.current.hasConnection(id, handleId);
      return isHandleConnected(id, handleId, getEdges());
    },
    [id, getEdges]
  );

  const resolveInput = useCallback(
    (handleId: string) => {
      if (dataRef.current?.resolveInput) return dataRef.current.resolveInput(id, handleId);
      const edges = getEdges();
      const nodes = getNodes() as Node<NodeData>[];
      // simplified local fallback
      const incoming = edges.filter((e) => e.target === id && e.targetHandle === handleId);
      if (incoming.length === 0) return null;
      return resolveInputBase(id, handleId, edges, nodes);
    },
    [id, getEdges, getNodes]
  );

  const disconnect = useCallback(
    (handleId: string) => {
      if (dataRef.current?.onUnlink) {
        dataRef.current.onUnlink(id, handleId);
        return;
      }
      setEdges((eds) => eds.filter((e) => !(e.target === id && e.targetHandle === handleId)));
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('canvas-dirty'));
    },
    [id, setEdges]
  );

  const disconnectNode = useCallback(
    () => {
      if (dataRef.current?.onDisconnectNode) {
        dataRef.current.onDisconnectNode(id);
        return;
      }
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('canvas-dirty'));
    },
    [id, setEdges]
  );

  const conn = useCallback(
    (handleId: string) => ({
      connected: hasConnection(handleId),
      info: getConnInfo(handleId),
      disconnect: () => disconnect(handleId),
    }),
    [hasConnection, getConnInfo, disconnect]
  );

  const resolve = useMemo(() => ({
    image: (handleId: string, localFallback?: string) => {
      let images = resolveInput(handleId);
      if (!images?.length && localFallback) images = [localFallback];
      return images;
    },
    text: (handleId: string, localFallback?: string) => {
      return resolveInput(handleId) || localFallback || '';
    },
    audio: (handleId: string, localFallback?: string) => {
      return resolveInput(handleId) || localFallback;
    },
    video: (handleId: string, localFallback?: string) => {
      return resolveInput(handleId) || localFallback;
    },
    raw: (handleId: string) => resolveInput(handleId),
  }), [resolveInput]);

  return { update, conn, resolve, hasConnection, getConnInfo, resolveInput, disconnect, disconnectNode };
}
