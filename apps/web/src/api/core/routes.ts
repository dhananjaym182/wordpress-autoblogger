export const APP_ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  verifyEmail: '/verify-email',
  dashboard: '/dashboard',
  dashboardProjects: '/dashboard/projects',
  dashboardContent: '/dashboard/content',
  dashboardPlanner: '/dashboard/planner',
  dashboardAi: '/dashboard/ai',
  dashboardJobs: '/dashboard/jobs',
  dashboardBilling: '/dashboard/billing',
  dashboardSettings: '/dashboard/settings',
  legalPrivacy: '/legal/privacy',
  legalTerms: '/legal/terms',
  legalCookies: '/legal/cookies',
  legalDpa: '/legal/dpa',
  docsApi: '/docs/api',
} as const;

export const API_ROUTES = {
  health: '/api/health',
  openapi: '/api/openapi',
} as const;

export const LEGACY_ROUTES = {
  projects: '/projects',
} as const;

export const DASHBOARD_REVALIDATE_PATHS = [
  APP_ROUTES.dashboard,
  APP_ROUTES.dashboardProjects,
  APP_ROUTES.dashboardContent,
  APP_ROUTES.dashboardPlanner,
  APP_ROUTES.dashboardAi,
  APP_ROUTES.dashboardJobs,
  APP_ROUTES.dashboardBilling,
  APP_ROUTES.dashboardSettings,
] as const;

