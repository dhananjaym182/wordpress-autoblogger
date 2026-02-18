import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { UnauthorizedError } from './errors';

export const getSessionOrNull = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};

export const requireSession = async () => {
  const session = await getSessionOrNull();

  if (!session) {
    throw new UnauthorizedError();
  }

  return session;
};

