/**
 * Custom error classes for API operations
 */

/**
 * Base API Error class
 */
export class APIError extends Error {
  public readonly statusCode?: number;
  public readonly response?: unknown;

  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.response = response;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }
}

/**
 * Network-related errors (connection failures, timeouts, etc.)
 */
export class NetworkError extends APIError {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Validation errors (invalid request data, missing required fields, etc.)
 */
export class ValidationError extends APIError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 400);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Authentication/Authorization errors
 */
export class AuthError extends APIError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthError';
  }
}

/**
 * Resource not found errors
 */
export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Server errors (5xx responses)
 */
export class ServerError extends APIError {
  constructor(message: string = 'Server error occurred', statusCode: number = 500) {
    super(message, statusCode);
    this.name = 'ServerError';
  }
}

/**
 * Helper to determine if an error is an API error
 */
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

/**
 * Helper to get a user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isAPIError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
