import { useCallback, useMemo } from 'react';

/**
 * Hook that wraps connection-related data callbacks for a node.
 * Returns helpers to check connections, resolve inputs, and get connection info.
 *
 * Usage:
 *   const { conn, resolve, update } = useNodeConnections(id, data);
 *   const { connected, info } = conn('image-in');
 *   const images = resolve.image('image-in');
 */
interface NodeData {
  onUpdate?: (nodeId: string, patch: Record<string, any>) => void;
  getConnectionInfo?: (nodeId: string, handleId: string) => any;
  hasConnection?: (nodeId: string, handleId: string) => boolean;
  resolveInput?: (nodeId: string, handleId: string) => any;
  onUnlink?: (nodeId: string, handleId: string) => void;
  onDisconnectNode?: (nodeId: string) => void;
}

export default function useNodeConnections(id: string, data: NodeData) {
  const update = useCallback(
    (patch: Record<string, any>) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback(
    (handleId: string) => data.getConnectionInfo?.(id, handleId) || null,
    [id, data]
  );

  const hasConnection = useCallback(
    (handleId: string) => !!data.hasConnection?.(id, handleId),
    [id, data]
  );

  const resolveInput = useCallback(
    (handleId: string) => data.resolveInput?.(id, handleId),
    [id, data]
  );

  const disconnect = useCallback(
    (handleId: string) => data.onUnlink?.(id, handleId),
    [id, data]
  );

  const disconnectNode = useCallback(
    () => data.onDisconnectNode?.(id),
    [id, data]
  );

  // Convenience: get connection state for a handle
  const conn = useCallback(
    (handleId: string) => ({
      connected: hasConnection(handleId),
      info: getConnInfo(handleId),
      disconnect: () => disconnect(handleId),
    }),
    [hasConnection, getConnInfo, disconnect]
  );

  // Convenience resolvers for common types
  const resolve = useMemo(() => ({
    // Resolve image input with localImage fallback
    image: (handleId: string, localFallback?: string) => {
      let images = resolveInput(handleId);
      if (!images?.length && localFallback) images = [localFallback];
      return images;
    },
    // Resolve text input with local fallback
    text: (handleId: string, localFallback?: string) => {
      return resolveInput(handleId) || localFallback || '';
    },
    // Resolve raw value
    raw: (handleId: string) => resolveInput(handleId),
  }), [resolveInput]);

  return { update, conn, resolve, hasConnection, getConnInfo, resolveInput, disconnect, disconnectNode };
}
