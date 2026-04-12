import { Handle, Position, type HandleProps, useStore } from '@xyflow/react';
import type { CSSProperties } from 'react';
import { getHandleColor } from '../utils/handleTypes';
import { motion } from 'framer-motion';

export type HandleDotSide = 'left' | 'right';

export interface HandleDotProps {
  type: HandleProps['type'];
  position: HandleDotSide;
  id: string;
  label?: string;
  style?: CSSProperties;
}

// Selector to see if a connection is currently in progress
const connectionSelector = (state: any) => state.connectionNodeId !== null;

export default function HandleDot({
  type,
  position,
  id,
  label,
  style = {},
}: HandleDotProps) {
  const color = getHandleColor(id);
  const isLeft = position === 'left';
  const isConnecting = useStore(connectionSelector);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        padding: '4px 0',
        ...style,
      }}
    >
      {!isLeft && label && (
        <span style={{ fontSize: 10, color: '#999', marginRight: 8 }}>{label}</span>
      )}
      <div style={{ position: 'relative' }}>
        {/* Magnetic Pulse Ring while connecting */}
        {isConnecting && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeOut" 
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 10,
              height: 10,
              marginLeft: -5,
              marginTop: -5,
              borderRadius: '50%',
              background: color,
              pointerEvents: 'none'
            }}
          />
        )}
        <motion.div
          whileHover={{ scale: 1.4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Handle
            type={type}
            position={isLeft ? Position.Left : Position.Right}
            id={id}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: color,
              border: 'none',
              position: 'relative',
              top: 'auto',
              left: 'auto',
              right: 'auto',
              transform: 'none',
            }}
          />
        </motion.div>
      </div>
      {isLeft && label && (
        <span style={{ fontSize: 10, color: '#999', marginLeft: 8 }}>{label}</span>
      )}
    </div>
  );
}
