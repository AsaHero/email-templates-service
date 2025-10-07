/**
 * Logger Utility
 *
 * Centralized logging using Winston with structured logging support.
 */

import winston from "winston";
import { emailConfig } from "../config/email.config";

/**
 * Custom log levels
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

/**
 * Log level colors for console output
 */
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

/**
 * Simple format for development
 */
const simpleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const metaString = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : "";
    return `${timestamp} [${level}]: ${message}${metaString}`;
  })
);

/**
 * JSON format for production
 */
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Create the logger instance
 */
const logger = winston.createLogger({
  level: emailConfig.logging.level,
  levels,
  format: emailConfig.logging.format === "json" ? jsonFormat : simpleFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: emailConfig.logging.format === "json" ? jsonFormat : simpleFormat,
    }),
    // Error log file (only in production)
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: jsonFormat,
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
            format: jsonFormat,
          }),
        ]
      : []),
  ],
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new winston.transports.Console({
      format: emailConfig.logging.format === "json" ? jsonFormat : simpleFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: emailConfig.logging.format === "json" ? jsonFormat : simpleFormat,
    }),
  ],
});

/**
 * Structured logging helper functions
 */
export const log = {
  /**
   * Log an error
   */
  error: (
    message: string,
    error?: Error | unknown,
    meta?: Record<string, unknown>
  ) => {
    if (error instanceof Error) {
      logger.error(message, {
        error: error.message,
        stack: error.stack,
        ...meta,
      });
    } else {
      logger.error(message, { error, ...meta });
    }
  },

  /**
   * Log a warning
   */
  warn: (message: string, meta?: Record<string, unknown>) => {
    logger.warn(message, meta);
  },

  /**
   * Log general information
   */
  info: (message: string, meta?: Record<string, unknown>) => {
    logger.info(message, meta);
  },

  /**
   * Log HTTP requests
   */
  http: (message: string, meta?: Record<string, unknown>) => {
    logger.http(message, meta);
  },

  /**
   * Log debug information
   */
  debug: (message: string, meta?: Record<string, unknown>) => {
    logger.debug(message, meta);
  },

  /**
   * Log email rendering events
   */
  emailRender: (
    template: string,
    success: boolean,
    duration?: number,
    meta?: Record<string, unknown>
  ) => {
    logger.info("Email render", {
      template,
      success,
      duration: duration ? `${duration}ms` : undefined,
      ...meta,
    });
  },

  /**
   * Log validation errors
   */
  validationError: (
    errors: Array<{ field: string; message: string }>,
    meta?: Record<string, unknown>
  ) => {
    logger.warn("Validation error", {
      errors,
      ...meta,
    });
  },

  /**
   * Log API requests
   */
  apiRequest: (
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    meta?: Record<string, unknown>
  ) => {
    logger.http("API request", {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ...meta,
    });
  },
};

export default logger;
