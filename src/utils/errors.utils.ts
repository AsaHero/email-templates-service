/**
 * Custom Error Classes
 *
 * Defines custom error types for better error handling and reporting.
 */

import { ValidationError } from "../types/email.types";

/**
 * Base application error
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error (400)
 */
export class ValidationErrorException extends AppError {
  public readonly errors: ValidationError[];

  constructor(message: string, errors: ValidationError[] = []) {
    super(message, 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

/**
 * Template not found error (404)
 */
export class TemplateNotFoundError extends AppError {
  constructor(templateName: string) {
    super(`Template '${templateName}' not found`, 404, "TEMPLATE_NOT_FOUND");
  }
}

/**
 * Block type not supported error (400)
 */
export class UnsupportedBlockTypeError extends AppError {
  constructor(blockType: string) {
    super(
      `Block type '${blockType}' is not supported`,
      400,
      "UNSUPPORTED_BLOCK_TYPE"
    );
  }
}

/**
 * Block limit exceeded error (400)
 */
export class BlockLimitExceededError extends AppError {
  constructor(actual: number, max: number) {
    super(
      `Block limit exceeded: ${actual} blocks provided, maximum is ${max}`,
      400,
      "BLOCK_LIMIT_EXCEEDED"
    );
  }
}

/**
 * Rendering error (500)
 */
export class RenderingError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(`Failed to render email: ${message}`, 500, "RENDERING_ERROR");
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

/**
 * Configuration error (500)
 */
export class ConfigurationError extends AppError {
  constructor(message: string) {
    super(`Configuration error: ${message}`, 500, "CONFIGURATION_ERROR", false);
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(retryAfter: number) {
    super(
      "Too many requests, please try again later",
      429,
      "RATE_LIMIT_EXCEEDED"
    );
    this.retryAfter = retryAfter;
  }
}

/**
 * Check if error is operational (expected) or programming error
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: Error | AppError): {
  error: {
    code: string;
    message: string;
    details?: ValidationError[];
  };
} {
  if (error instanceof ValidationErrorException) {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: error.errors,
      },
    };
  }

  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  // Unknown error - don't expose internal details in production
  return {
    error: {
      code: "INTERNAL_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "An internal error occurred"
          : error.message,
    },
  };
}
