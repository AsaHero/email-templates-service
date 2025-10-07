/**
 * Error Handling Middleware
 *
 * Central error handler for all API errors.
 */

import { Request, Response, NextFunction } from "express";
import { log } from "../utils/logger.utils";
import { formatErrorResponse, AppError } from "../utils/errors.utils";

/**
 * Global error handler
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  log.error("Request error", error, {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  // Handle operational errors (expected errors)
  if (error instanceof AppError) {
    const response = formatErrorResponse(error);
    res.status(error.statusCode).json(response);
    return;
  }

  // Handle unexpected errors
  const statusCode = 500;
  const response = {
    error: {
      code: "INTERNAL_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "An internal error occurred"
          : error.message,
    },
  };

  res.status(statusCode).json(response);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  log.warn("Route not found", {
    method: req.method,
    path: req.path,
  });

  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}
