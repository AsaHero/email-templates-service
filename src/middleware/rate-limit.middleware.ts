/**
 * Rate Limiting Middleware
 *
 * Protects API from abuse with rate limiting.
 */

import rateLimit from "express-rate-limit";
import { emailConfig } from "../config/email.config";
import { log } from "../utils/logger.utils";

/**
 * Create rate limiter for email rendering endpoint
 */
export const renderRateLimiter = rateLimit({
  windowMs: emailConfig.rateLimit.windowMs,
  max: emailConfig.rateLimit.maxRequests,
  message: {
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
    },
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  handler: (req, res) => {
    log.warn("Rate limit exceeded", {
      ip: req.ip,
      path: req.path,
    });

    res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests, please try again later",
      },
    });
  },
});
