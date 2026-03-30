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
export default function useNodeConnections(id, data) {
  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback(
    (handleId) => data.getConnectionInfo?.(id, handleId) || null,
    [id, data]
  );

  const hasConnection = useCallback(
    (handleId) => !!data.hasConnection?.(id, handleId),
    [id, data]
  );

  const resolveInput = useCallback(
    (handleId) => data.resolveInput?.(id, handleId),
    [id, data]
  );

  const disconnect = useCallback(
    (handleId) => data.onUnlink?.(id, handleId),
    [id, data]
  );

  const disconnectNode = useCallback(
    () => data.onDisconnectNode?.(id),
    [id, data]
  );

  // Convenience: get connection state for a handle
  const conn = useCallback(
    (handleId) => ({
      connected: hasConnection(handleId),
      info: getConnInfo(handleId),
      disconnect: () => disconnect(handleId),
    }),
    [hasConnection, getConnInfo, disconnect]
  );

  // Convenience resolvers for common types
  const resolve = useMemo(() => ({
    // Resolve image input with localImage fallback
    image: (handleId, localFallback) => {
      let images = resolveInput(handleId);
      if (!images?.length && localFallback) images = [localFallback];
      return images;
    },
    // Resolve text input with local fallback
    text: (handleId, localFallback) => {
      return resolveInput(handleId) || localFallback || '';
    },
    // Resolve raw value
    raw: (handleId) => resolveInput(handleId),
  }), [resolveInput]);

  return { update, conn, resolve, hasConnection, getConnInfo, resolveInput, disconnect, disconnectNode };
}
