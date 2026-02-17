import { init as sentryInit } from '@sentry/nextjs';

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    sentryInit({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Filter out sensitive data
      beforeSend(event) {
        // Remove potentially sensitive headers
        if (event.request?.headers) {
          const sensitiveHeaders = [
            'authorization',
            'cookie',
            'x-api-key',
            'x-ab-signature',
            'x-ab-keyid',
          ];
          
          for (const header of sensitiveHeaders) {
            if (event.request.headers[header]) {
              event.request.headers[header] = '[Filtered]';
            }
          }
        }

        // Remove sensitive data from user context
        if (event.user) {
          delete event.user.email;
          delete event.user.ip_address;
        }

        return event;
      },

      // Ignore certain errors
      ignoreErrors: [
        // Browser extensions
        'chrome-extension',
        'moz-extension',
        'safari-extension',
        // Network errors
        'Network Error',
        'Failed to fetch',
        'NetworkError',
        // Common non-actionable errors
        'ResizeObserver loop limit exceeded',
        'Non-Error exception captured',
      ],
    });
  }
}
