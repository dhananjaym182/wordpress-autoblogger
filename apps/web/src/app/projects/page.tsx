import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/api/core/routes';

export default function LegacyProjectsPage() {
  redirect(APP_ROUTES.dashboardProjects);
}

