export interface AuditLogEntry {
  id: string;
  organizationId?: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export type AuditAction =
  // Auth actions
  | 'user.login'
  | 'user.logout'
  | 'user.signup'
  | 'user.verify_email'
  | 'user.password_reset'
  // Organization actions
  | 'org.create'
  | 'org.update'
  | 'org.delete'
  | 'org.invite_member'
  | 'org.remove_member'
  // Project actions
  | 'project.create'
  | 'project.update'
  | 'project.delete'
  // WordPress actions
  | 'wp.connect'
  | 'wp.disconnect'
  | 'wp.test_connection'
  // Post actions
  | 'post.create'
  | 'post.update'
  | 'post.schedule'
  | 'post.publish'
  | 'post.delete'
  // AI actions
  | 'ai.generate_content'
  | 'ai.generate_image'
  | 'ai.add_provider'
  | 'ai.delete_provider'
  // Billing actions
  | 'billing.subscribe'
  | 'billing.cancel'
  | 'billing.update_payment';

export class AuditLogger {
  constructor(
    private logFn: (entry: AuditLogEntry) => Promise<void> | void
  ) {}

  async log(
    action: AuditAction,
    params: {
      organizationId?: string;
      userId?: string;
      resourceType: string;
      resourceId?: string;
      metadata?: Record<string, unknown>;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    const entry: AuditLogEntry = {
      id: this.generateId(),
      action,
      createdAt: new Date(),
      ...params,
    };

    try {
      await this.logFn(entry);
    } catch (error) {
      // Log to console as fallback
      console.error('Failed to write audit log:', error);
      console.error('Audit entry:', entry);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Console audit logger for development
export const consoleAuditLogger = new AuditLogger((entry) => {
  console.log('[AUDIT]', entry);
});

// Helper to extract IP from request
export function extractIpAddress(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string | undefined {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0].split(',')[0].trim();
  }
  return req.socket?.remoteAddress;
}

// Helper to extract user agent
export function extractUserAgent(req: { headers: Record<string, string | string[] | undefined> }): string | undefined {
  const ua = req.headers['user-agent'];
  return typeof ua === 'string' ? ua : undefined;
}
