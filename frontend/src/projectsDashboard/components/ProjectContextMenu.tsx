import type { FC } from 'react';
import type { User } from 'firebase/auth';
import type { Project } from '../types';

export interface ProjectContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string, project: Project) => void;
  project: Project;
  user: User | null;
}

export const ProjectContextMenu: FC<ProjectContextMenuProps> = ({ x, y, onClose, onAction, project, user }) => {
  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          background: 'transparent',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: y,
          left: x,
          zIndex: 9999,
          width: 200,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: '6px',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.1s ease-out',
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .menu-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 8px 12px;
            background: transparent;
            border: none;
            border-radius: 6px;
            color: var(--color-text);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.1s;
            text-align: left;
          }
          .menu-item:hover {
            background: var(--color-surface-hover);
          }
          .menu-item.danger {
            color: var(--color-danger);
          }
          .menu-item.disabled {
            color: var(--color-text-muted);
            cursor: default;
          }
          .menu-item.disabled:hover {
            background: transparent;
          }
          .menu-separator {
            height: 1px;
            background: var(--border-subtle);
            margin: 4px 0;
          }
        `}</style>

        {project.deleted ? (
          <>
            <button type="button" className="menu-item" onClick={() => { onAction('restore', project); onClose(); }}>
              Restore
            </button>
            <button type="button" className="menu-item danger" onClick={() => { onAction('permanent-delete', project); onClose(); }}>
              Permanently Delete
            </button>
          </>
        ) : (
          <>
            <button type="button" className="menu-item" onClick={() => { onAction('open', project); onClose(); }}>
              Open
            </button>
            <button type="button" className="menu-item" onClick={() => { onAction('open-new-tab', project); onClose(); }}>
              Open in new tab
            </button>
            <button type="button" className="menu-item" onClick={() => { onAction('duplicate', project); onClose(); }}>
              Duplicate board
            </button>
            {project.userId !== user?.uid && (
              <button type="button" className="menu-item" onClick={() => { onAction('clone', project); onClose(); }}>
                Clone to my boards
              </button>
            )}
            <button type="button" className="menu-item disabled" disabled>
              Remove from folder
            </button>
            <div className="menu-separator" />
            <button type="button" className="menu-item" onClick={() => { onAction('favorite', project); onClose(); }}>
              {project.favorite ? 'Remove from favorites' : 'Favorite'}
            </button>
            <button type="button" className="menu-item" onClick={() => { onAction('public', project); onClose(); }}>
              {project.isPublic ? 'Make board private' : 'Make board public'}
            </button>
            <button type="button" className="menu-item" onClick={() => { onAction('share', project); onClose(); }}>
              Share with user
            </button>
            <div className="menu-separator" />
            <button type="button" className="menu-item danger" onClick={() => { onAction('delete', project); onClose(); }}>
              Delete board
            </button>
          </>
        )}
      </div>
    </>
  );
};
