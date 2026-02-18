import { getSessionOrNull } from '@/api/core/auth-context';
import { getProjectSwitcherState } from '@/api/projects/service';
import { ProjectSwitcherClient } from './ProjectSwitcherClient';

export async function ProjectSwitcher() {
  const session = await getSessionOrNull();

  if (!session) {
    return null;
  }

  try {
    const state = await getProjectSwitcherState(session.user.id);
    return <ProjectSwitcherClient projects={state.projects} activeProjectId={state.activeProjectId} />;
  } catch {
    return null;
  }
}
