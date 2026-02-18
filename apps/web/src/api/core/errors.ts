export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class NotConfiguredError extends AppError {
  constructor(message = 'Feature is not configured') {
    super(message, 'NOT_CONFIGURED', 503);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export const toActionError = (error: unknown, fallback: string) => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
