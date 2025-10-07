/**
 * Request Logging Middleware
 *
 * Logs all incoming requests and outgoing responses.
 */

import { Request, Response, NextFunction } from "express";
import { log } from "../utils/logger.utils";

/**
 * Request logger middleware
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  // Log request
  log.http("Incoming request", {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  // Capture response
  res.on("finish", () => {
    const duration = Date.now() - startTime;

    log.apiRequest(req.method, req.path, res.statusCode, duration, {
      ip: req.ip,
    });
  });

  next();
}
