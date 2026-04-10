import { Handle, Position, type HandleProps } from '@xyflow/react';
import type { CSSProperties } from 'react';
import { getHandleColor } from '../utils/handleTypes';

export type HandleDotSide = 'left' | 'right';

export interface HandleDotProps {
  type: HandleProps['type'];
  position: HandleDotSide;
  id: string;
  label?: string;
  style?: CSSProperties;
}

export default function HandleDot({
  type,
  position,
  id,
  label,
  style = {},
}: HandleDotProps) {
  const color = getHandleColor(id);
  const isLeft = position === 'left';

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
      {isLeft && label && (
        <span style={{ fontSize: 10, color: '#999', marginLeft: 8 }}>{label}</span>
      )}
    </div>
  );
}
