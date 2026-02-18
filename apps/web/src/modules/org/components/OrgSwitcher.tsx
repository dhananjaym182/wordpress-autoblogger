import { getSessionOrNull } from '@/api/core/auth-context';
import { getOrganizationSwitcherState } from '@/api/org/service';
import { OrgSwitcherClient } from './OrgSwitcherClient';

export async function OrgSwitcher() {
  const session = await getSessionOrNull();

  if (!session) {
    return null;
  }

  try {
    const state = await getOrganizationSwitcherState(session.user.id);
    return (
      <OrgSwitcherClient
        organizations={state.organizations}
        activeOrganizationId={state.activeOrganizationId}
      />
    );
  } catch {
    return null;
  }
}

