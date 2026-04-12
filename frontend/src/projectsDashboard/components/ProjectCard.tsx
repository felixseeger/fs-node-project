import type { FC, MouseEvent } from 'react';
import type { Project } from '../types';
import { truncate, formatDate } from '../utils';
import { ProjectThumbnail } from './ProjectThumbnail';

export interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onContextMenu: (e: MouseEvent, project: Project) => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project, onClick, onContextMenu }) => {
  const title = project.name || project.title || 'Untitled';
  const updatedAt = project.updatedAt ?? 'Just now';
  const thumbnail = project.thumbnail;
  const authorName = project.authorName;

  return (
    <div onClick={onClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }} role="button" tabIndex={0} onContextMenu={(e) => onContextMenu(e, project)} className="project-card">
      <ProjectThumbnail src={thumbnail} />
      <div className="project-card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div
            className="project-card-title"
            style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={title}
          >
            {truncate(title, 36)}
          </div>
          {project.isPublic && (
            <span
              style={{
                fontSize: 10,
                background: 'var(--color-accent-soft)',
                color: 'var(--color-accent)',
                padding: '2px 6px',
                borderRadius: 4,
                marginLeft: 8,
              }}
            >
              Public
            </span>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <div className="project-card-date">{formatDate(updatedAt)}</div>
          {authorName && (
            <div
              style={{
                fontSize: 11,
                color: 'var(--color-text-dim)',
                fontStyle: 'italic',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 120,
              }}
              title={authorName}
            >
              by {truncate(authorName, 16)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
