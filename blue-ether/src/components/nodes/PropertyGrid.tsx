import type { FC, ReactNode } from 'react';

export interface PropertyItem {
  key: string;
  value: string | number | boolean;
  type?: 'text' | 'password' | 'number' | 'boolean' | 'tag';
  icon?: ReactNode;
}

export interface PropertyGridProps {
  properties: PropertyItem[];
  title?: string;
  onPropertyChange?: (key: string, newValue: any) => void;
  readOnly?: boolean;
}

const PropertyGrid: FC<PropertyGridProps> = ({
  properties,
  title,
  onPropertyChange,
  readOnly = false
}) => {
  const handleToggle = (key: string, currentValue: any) => {
    if (readOnly || !onPropertyChange) return;
    onPropertyChange(key, !currentValue);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
    }}>
      {title && (
        <div style={{ 
          fontSize: 11, 
          fontWeight: 800, 
          color: 'var(--be-color-text-muted)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          {title}
        </div>
      )}
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--be-radius-md)',
        border: '1px solid var(--be-color-border)',
        overflow: 'hidden',
        background: 'var(--be-surface-sunken)',
      }}>
        {properties.map((prop, i) => (
          <div 
            key={prop.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 12px',
              borderBottom: i === properties.length - 1 ? 'none' : '1px solid var(--be-color-border)',
              gap: '12px',
              transition: 'background 0.2s',
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              width: '40%',
              flexShrink: 0 
            }}>
              {prop.icon && <span style={{ color: 'var(--be-color-text-muted)', display: 'flex' }}>{prop.icon}</span>}
              <span style={{ 
                fontSize: 12, 
                color: 'var(--be-color-text)',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }} title={prop.key}>
                {prop.key}
              </span>
            </div>

            <div style={{ 
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              overflow: 'hidden'
            }}>
              {prop.type === 'password' ? (
                <span style={{ color: 'var(--be-color-text-muted)', letterSpacing: '0.2em', fontSize: 10 }}>
                  ••••••••••••
                </span>
              ) : prop.type === 'boolean' ? (
                <div 
                  onClick={() => handleToggle(prop.key, prop.value)}
                  style={{
                  width: 32,
                  height: 18,
                  borderRadius: 9,
                  background: prop.value ? 'var(--be-color-accent)' : 'var(--be-color-border)',
                  position: 'relative',
                  cursor: readOnly ? 'default' : 'pointer'
                }}>
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: 2,
                    left: prop.value ? 16 : 2,
                    transition: 'left 0.2s'
                  }} />
                </div>
              ) : prop.type === 'tag' ? (
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--be-radius-pill)',
                  background: 'var(--be-color-accent-muted)',
                  color: 'var(--be-color-accent)',
                  fontSize: 10,
                  fontWeight: 700,
                  border: '1px solid var(--be-color-accent-muted)'
                }}>
                  {String(prop.value)}
                </span>
              ) : (
                <span style={{ 
                  fontSize: 12, 
                  color: 'var(--be-color-text-muted)',
                  textAlign: 'right',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {String(prop.value)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;
