import React, { createContext, useContext, type ReactNode } from 'react';

interface CanvasContextType {
  updateNodeData: (nodeId: string, patch: any) => void;
  resolveInput: (nodeId: string, handleId: string, originalHandleId?: string) => any;
  hasConnection: (nodeId: string, handleId: string) => boolean;
  getConnectionInfo: (nodeId: string, handleId: string) => any;
  onAnalyzeComplete: (id: string) => void;
  onUnlink: (targetNodeId: string, targetHandle: string) => void;
  onDisconnectNode: (id: string) => void;
  onCreateNode: (type: string, dataPatch: any, sourceHandle: string, targetHandle: string, sourceId: string) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ value: CanvasContextType; children: ReactNode }> = ({ value, children }) => {
  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
