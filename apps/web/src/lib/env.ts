import { z } from 'zod';

const toTrimmedString = (value: unknown) => (typeof value === 'string' ? value.trim() : value);

const optionalString = () =>
  z.preprocess((value) => {
    const normalized = toTrimmedString(value);
    if (typeof normalized !== 'string' || normalized.length === 0) {
      return undefined;
    }
    return normalized;
  }, z.string().optional());

const optionalUrl = () =>
  z.preprocess((value) => {
    const normalized = toTrimmedString(value);
    if (typeof normalized !== 'string' || normalized.length === 0) {
      return undefined;
    }

    try {
      new URL(normalized);
      return normalized;
    } catch {
      return undefined;
    }
  }, z.string().optional());

const optionalStartsWith = (prefix: string) =>
  z.preprocess((value) => {
    const normalized = toTrimmedString(value);
    if (typeof normalized !== 'string' || normalized.length === 0) {
      return undefined;
    }
    return normalized.startsWith(prefix) ? normalized : undefined;
  }, z.string().optional());

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // Auth
  BETTER_AUTH_SECRET: z.preprocess((value) => {
    const normalized = toTrimmedString(value);
    if (typeof normalized !== 'string' || normalized.length === 0) {
      return undefined;
    }
    return normalized.length >= 32 ? normalized : undefined;
  }, z.string().optional()),
  BETTER_AUTH_BASE_URL: optionalUrl(),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // OAuth
  GOOGLE_CLIENT_ID: optionalString(),
  GOOGLE_CLIENT_SECRET: optionalString(),
  GITHUB_CLIENT_ID: optionalString(),
  GITHUB_CLIENT_SECRET: optionalString(),

  // Email
  MAILJET_API_KEY: optionalString(),
  MAILJET_SECRET_KEY: optionalString(),
  MAILJET_FROM_EMAIL: z.preprocess((value) => {
    const normalized = toTrimmedString(value);
    if (typeof normalized !== 'string' || normalized.length === 0) {
      return undefined;
    }
    return /.+@.+\..+/.test(normalized) ? normalized : undefined;
  }, z.string().optional()),
  MAILJET_FROM_NAME: optionalString(),

  // Stripe
  STRIPE_SECRET_KEY: optionalStartsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: optionalString(),
  STRIPE_PUBLISHABLE_KEY: optionalStartsWith('pk_'),
  STRIPE_PRICE_STARTER: optionalString(),
  STRIPE_PRICE_PRO: optionalString(),

  // Storage
  R2_ACCOUNT_ID: optionalString(),
  R2_ACCESS_KEY_ID: optionalString(),
  R2_SECRET_ACCESS_KEY: optionalString(),
  R2_BUCKET: optionalString(),
  CDN_URL: optionalUrl(),

  // AI Providers
  OPENAI_API_KEY: optionalStartsWith('sk-'),
  ANTHROPIC_API_KEY: optionalStartsWith('sk-ant-'),

  // Encryption
  ENCRYPTION_KEY: z.string().length(32),

  // Monitoring
  SENTRY_DSN: optionalUrl(),
  POSTHOG_API_KEY: optionalString(),
  POSTHOG_HOST: optionalUrl(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((e) => e.path.join('.'))
        .join(', ');
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
