import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook that encapsulates the common node execution lifecycle:
 * - Trigger listening (data.triggerGenerate)
 * - Loading state
 * - Error state
 * - API call → poll → result pattern
 *
 * Returns { isLoading, execute } where execute() runs the handler
 * and the hook auto-runs it on triggerGenerate changes.
 */
interface NodeExecutionData {
  triggerGenerate?: any;
}

export default function useNodeExecution(data: NodeExecutionData, handler: () => Promise<void>) {
  const [isLoading, setIsLoading] = useState(false);
  const lastTrigger = useRef<any>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    try {
      await handler();
    } finally {
      setIsLoading(false);
    }
  }, [handler]);

  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      execute();
    }
  }, [data.triggerGenerate, execute]);

  return { isLoading, execute };
}
