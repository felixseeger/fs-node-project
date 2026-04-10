import type { FC, ReactNode } from 'react';
import { truncate } from '../utils';

export interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  count?: number | string;
}

export const SidebarItem: FC<SidebarItemProps> = ({ icon, label, active, onClick, count }) => {
  return (
    <button type="button" onClick={onClick} className={`sidebar-item ${active ? 'active' : ''}`}>
      <span className="sidebar-item-icon">{icon}</span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={label}>
        {truncate(label, 30)}
      </span>
      {count !== undefined && (
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', flexShrink: 0 }}>
          {typeof count === 'number' ? (count > 999 ? '999+' : count) : count}
        </span>
      )}
    </button>
  );
};
