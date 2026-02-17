import crypto from 'crypto';

export function generateTraceId(): string {
  return `trace-${crypto.randomUUID()}`;
}

export function generateSpanId(): string {
  return crypto.randomBytes(8).toString('hex');
}
