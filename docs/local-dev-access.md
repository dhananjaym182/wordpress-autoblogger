# Local Development Access

This file documents local-only credentials for debugging and QA.

## Test User (verified)

- Email: `test@magnetbyte.com`
- Password: `test@1234`
- Verified: `true` (manually set in local DB)

## Manual verification SQL (local only)

Use this when SMTP/email delivery is not configured in development.

```sql
UPDATE "user"
SET "emailVerified" = true,
    "updatedAt" = NOW()
WHERE email = 'test@magnetbyte.com';
```

## Why this is needed

In local setup, `MAILJET_SECRET_KEY` may be empty, so verification mail sending can fail in background tasks.
This prevents normal click-through verification flow even when signup succeeds.
