import { getSessionOrNull } from '@/api/core/auth-context';
import { getProjectSwitcherState } from '@/api/projects/service';
import { ProjectSwitcherClient } from './ProjectSwitcherClient';

export async function ProjectSwitcher() {
  const session = await getSessionOrNull();

  if (!session) {
    return null;
  }

  let state: Awaited<ReturnType<typeof getProjectSwitcherState>>;

  try {
    state = await getProjectSwitcherState(session.user.id);
  } catch {
    return null;
  }

  return <ProjectSwitcherClient projects={state.projects} activeProjectId={state.activeProjectId} />;
}
