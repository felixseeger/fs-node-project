import React, { type FC, type ReactNode } from 'react';


export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  items,
  separator = <span style={{ color: 'var(--be-color-text-muted)', opacity: 0.5, margin: '0 var(--be-space-2)' }}>/</span>,
  className = '',
  style = {},
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`be-breadcrumb ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: 'var(--be-font-size-sm)',
        ...style,
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && separator}
          <div
            onClick={item.onClick}
            style={{
              color: item.active ? 'var(--be-color-text)' : 'var(--be-color-text-muted)',
              fontWeight: item.active ? 600 : 400,
              cursor: item.onClick || item.href ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
          >
            {item.href ? (
              <a 
                href={item.href} 
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none',
                  ...(item.active ? {} : { ':hover': { color: 'var(--be-color-text)' } } as any)
                }}
              >
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
