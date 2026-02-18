import { getSessionOrNull } from '@/api/core/auth-context';
import { getOrganizationSwitcherState } from '@/api/org/service';
import { OrgSwitcherClient } from './OrgSwitcherClient';

export async function OrgSwitcher() {
  const session = await getSessionOrNull();

  if (!session) {
    return null;
  }

  let state: Awaited<ReturnType<typeof getOrganizationSwitcherState>>;

  try {
    state = await getOrganizationSwitcherState(session.user.id);
  } catch {
    return null;
  }

  return (
    <OrgSwitcherClient
      organizations={state.organizations}
      activeOrganizationId={state.activeOrganizationId}
    />
  );
}
