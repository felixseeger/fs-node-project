import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { Project, ShareModalState } from './types';

export interface UseProjectContextActionParams {
  onOpenProject?: (project: Project) => void;
  onUpdateProject?: (projectId: string, data: Partial<Project>) => void;
  onTogglePublic?: (projectId: string, isPublic: boolean) => void;
  onDeleteProject?: (projectId: string) => void;
  onDuplicateProject?: (project: Project) => void;
  onCloneProject?: (project: Project) => void;
  setShareModal: Dispatch<SetStateAction<ShareModalState | null>>;
  setShareEmail: Dispatch<SetStateAction<string>>;
}

export function useProjectContextAction({
  onOpenProject,
  onUpdateProject,
  onTogglePublic,
  onDeleteProject,
  onDuplicateProject,
  onCloneProject,
  setShareModal,
  setShareEmail,
}: UseProjectContextActionParams) {
  return useCallback(
    (action: string, project: Project) => {
      if (!project) return;
      const projectName = project.name || project.title || 'Untitled';
      const projectId = project.id;

      const safeCall = (fn: ((...args: unknown[]) => void) | undefined, ...args: unknown[]) => {
        try {
          fn?.(...args);
        } catch (err) {
          console.error(`[ProjectsDashboard] Error in ${action}:`, err);
        }
      };

      switch (action) {
        case 'open':
          safeCall(onOpenProject, project);
          break;

        case 'open-new-tab':
          try {
            window.open(`/editor?id=${projectId}`, '_blank');
          } catch {
            // popup blocked or invalid URL
          }
          break;

        case 'rename': {
          try {
            const newName = prompt('Rename board:', projectName);
            if (newName?.trim()) {
              safeCall(onUpdateProject, projectId, { name: newName.trim() });
            }
          } catch {
            // prompt cancelled or blocked
          }
          break;
        }

        case 'duplicate':
          safeCall(onDuplicateProject, project);
          break;

        case 'clone':
          safeCall(onCloneProject, project);
          break;

        case 'favorite':
          safeCall(onUpdateProject, projectId, { favorite: !project.favorite });
          break;

        case 'public':
          safeCall(onTogglePublic, projectId, !project.isPublic);
          break;

        case 'delete':
          try {
            if (confirm(`Move board "${projectName}" to trash?`)) {
              safeCall(onUpdateProject, projectId, { deleted: true, deletedAt: Date.now() });
            }
          } catch {
            // confirm cancelled
          }
          break;

        case 'restore':
          safeCall(onUpdateProject, projectId, { deleted: false });
          break;

        case 'permanent-delete':
          try {
            const label = project.name || project.title || 'this board';
            if (confirm(`Permanently delete board "${label}"? This cannot be undone.`)) {
              safeCall(onDeleteProject, projectId);
            }
          } catch {
            // confirm cancelled
          }
          break;

        case 'share': {
          const sharedWith = Array.isArray(project.sharedWith) ? project.sharedWith : [];
          setShareModal({ projectId, sharedWith });
          setShareEmail('');
          break;
        }

        default:
          break;
      }
    },
    [
      onOpenProject,
      onUpdateProject,
      onDuplicateProject,
      onCloneProject,
      onTogglePublic,
      onDeleteProject,
      setShareModal,
      setShareEmail,
    ],
  );
}
