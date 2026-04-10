import type { Project } from './types';

export function filterProjectsForSection(
  activeSection: string,
  searchQuery: string,
  projects: Project[],
  communityWorkflows: Project[],
  sharedWorkflows: Project[],
): Project[] {
  if (activeSection === 'shared') return sharedWorkflows;
  const baseList = activeSection === 'community' ? communityWorkflows : projects;
  const q = searchQuery.toLowerCase();

  return baseList.filter((p) => {
    const pName = p.name || p.title || '';
    if (!pName.toLowerCase().includes(q)) return false;
    if (activeSection === 'trash') return p.deleted;
    if (p.deleted) return false;
    if (activeSection === 'favorites') return p.favorite;
    if (activeSection === 'private') return !p.isPublic;
    if (activeSection === 'community') return true;
    return true;
  });
}
