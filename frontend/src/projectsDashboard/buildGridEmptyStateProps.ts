import type { EmptyStateProps, Project } from './types';
import { truncate } from './utils';

export interface BuildGridEmptyStateInput {
  activeSection: string;
  searchQuery: string;
  projects: Project[];
  onCreateProject?: (name?: string, thumbnail?: string) => void;
  onClearSearch: () => void;
  openNewProjectModal: () => void;
}

export function buildGridEmptyStateProps({
  activeSection,
  searchQuery,
  projects,
  onCreateProject,
  onClearSearch,
  openNewProjectModal,
}: BuildGridEmptyStateInput): EmptyStateProps {
  const q = searchQuery.trim();
  const hasSearch = q.length > 0;
  const aliveProjects = projects.filter((p) => !p.deleted);
  const hasAnyBoard = aliveProjects.length > 0;
  const anyPrivate = aliveProjects.some((p) => !p.isPublic);
  const anyFavorite = aliveProjects.some((p) => p.favorite);
  const createAction = onCreateProject ? openNewProjectModal : undefined;

  if (hasSearch) {
    return {
      title: 'No matching boards',
      hint: q
        ? `Nothing matches "${truncate(q, 30)}". Try another search or clear the filter.`
        : 'Try another search or clear the filter.',
      actionLabel: 'Clear search',
      onAction: onClearSearch,
    };
  }

  switch (activeSection) {
    case 'community':
      return {
        title: 'Nothing in Community yet',
        hint: 'Publish a workflow or check back when new templates appear.',
      };
    case 'shared':
      return {
        title: 'No shared boards yet',
        hint: 'When someone shares a workflow with you, it will show up here.',
      };
    case 'favorites':
      if (!hasAnyBoard) {
        return {
          title: 'Create your first workflow',
          hint: 'Then favorite boards from the menu to see them in this tab.',
          actionLabel: 'New Project',
          onAction: createAction,
        };
      }
      if (!anyFavorite) {
        return {
          title: 'No favorites yet',
          hint: 'Open a board, use the menu, and choose Favorite to pin it here.',
        };
      }
      return {
        title: 'No boards here',
        hint: 'Try another tab or adjust your search.',
      };
    case 'private':
      if (!hasAnyBoard) {
        return {
          title: 'Create your first workflow',
          hint: 'Boards you keep private show up in this view.',
          actionLabel: 'New Project',
          onAction: createAction,
        };
      }
      if (!anyPrivate) {
        return {
          title: 'No private boards yet',
          hint: 'Make a board private from its menu to list it under Private.',
        };
      }
      return {
        title: 'No private boards',
        hint: 'Try another tab or create a new private board.',
      };
    case 'recent':
    case 'all':
    case 'workflows':
    default:
      if (!hasAnyBoard) {
        return {
          title: 'Create your first workflow',
          hint: 'Start a board to build and run your node pipelines.',
          actionLabel: 'New Project',
          onAction: createAction,
        };
      }
      return {
        title: 'No boards here',
        hint: 'Try another tab or adjust your search.',
      };
  }
}
