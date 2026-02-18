import { NotFoundError } from '@/api/core/errors';
import { getProjectSwitcherState } from '@/api/projects/service';

export const getActiveProjectForUser = async (userId: string) => {
  const state = await getProjectSwitcherState(userId);

  if (!state.activeProjectId) {
    return {
      projects: state.projects,
      activeProject: null,
    };
  }

  const activeProject =
    state.projects.find((project: (typeof state.projects)[number]) => project.id === state.activeProjectId) ?? null;

  return {
    projects: state.projects,
    activeProject,
  };
};

export const requireActiveProjectForUser = async (userId: string) => {
  const { projects, activeProject } = await getActiveProjectForUser(userId);

  if (!activeProject) {
    throw new NotFoundError('No active project selected. Create or select a project first.');
  }

  return {
    projects,
    activeProject,
  };
};
