import { PageHeader } from '@/components/ui/page-header';
import { OrgSwitcher } from '@/modules/org/components/OrgSwitcher';
import { ProviderList } from '@/modules/ai/components/ProviderList';
import { requireSession } from '@/api/core/auth-context';
import { getAiProviderSettings } from '@/api/ai/service';
import { PLAN_LIMITS } from '@autoblogger/shared';
import { getActiveMembership } from '@/api/core/organization-context';

export default async function AIPage() {
  const session = await requireSession();
  const [data, membership] = await Promise.all([
    getAiProviderSettings(session.user.id),
    getActiveMembership(session.user.id),
  ]);
  const limits =
    PLAN_LIMITS[membership.activeMembership.organization.planId as keyof typeof PLAN_LIMITS] ??
    PLAN_LIMITS.free;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Infrastructure"
        description="Configure providers, validate endpoints, and control fallback behavior."
        actions={<OrgSwitcher />}
      />

      <ProviderList
        providers={data.providers.map((provider: (typeof data.providers)[number]) => ({
          id: provider.id,
          name: provider.name,
          mode: provider.mode as 'managed' | 'byok',
          baseUrl: provider.baseUrl,
          enabled: provider.enabled,
          defaultModelText: provider.defaultModelText,
          defaultModelImage: provider.defaultModelImage,
          capabilities: {
            text: (provider.capabilities as { text?: boolean })?.text ?? true,
            image: (provider.capabilities as { image?: boolean })?.image ?? false,
          },
          lastTestedAt: provider.lastTestedAt ? provider.lastTestedAt.toISOString() : null,
          lastError: provider.lastError,
        }))}
        fallbackPolicy={
          data.fallbackPolicy
            ? {
                textChain: data.fallbackPolicy.textChain,
                imageChain: data.fallbackPolicy.imageChain,
              }
            : null
        }
        canUseBYOK={limits.allowsBYOK}
        canConfigureManaged={['OWNER', 'ADMIN'].includes(membership.activeMembership.role)}
      />
    </div>
  );
}
