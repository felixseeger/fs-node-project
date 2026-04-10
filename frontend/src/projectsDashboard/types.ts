export interface Project {
  id: string;
  name?: string;
  title?: string;
  updatedAt?: unknown;
  thumbnail?: string;
  authorName?: string;
  isPublic?: boolean;
  deleted?: boolean;
  favorite?: boolean;
  userId?: string;
  sharedWith?: string[];
  deletedAt?: number;
}

export interface EmptyStateProps {
  title?: string;
  hint?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export interface ShareModalState {
  projectId: string;
  sharedWith: string[];
}

export interface ProjectsDashboardProps {
  projects?: Project[];
  communityWorkflows?: Project[];
  sharedWorkflows?: Project[];
  onShareWorkflow?: (projectId: string, email: string) => void;
  onUnshareWorkflow?: (projectId: string, email: string) => void;
  onCreateProject?: (name?: string, thumbnail?: string) => void;
  onImportWorkflowFile?: (file: File) => void;
  onPromptWorkflow?: (text: string) => void;
  onOpenProject?: (project: Project) => void;
  onUpdateProject?: (projectId: string, data: Partial<Project>) => void;
  onTogglePublic?: (projectId: string, isPublic: boolean) => void;
  onDeleteProject?: (projectId: string) => void;
  onDuplicateProject?: (project: Project) => void;
  onCloneProject?: (project: Project) => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  theme?: string;
  setTheme?: (theme: string) => void;
}
