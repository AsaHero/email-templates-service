/**
 * Email Templates API Server
 *
 * Main server file for the Anora email rendering service.
 */

import "dotenv/config";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { emailConfig, validateConfig } from "./config/email.config";
import { log } from "./utils/logger.utils";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/logger.middleware";
import healthRoutes from "./routes/health.routes";
import renderRoutes from "./routes/render.routes";
import templatesRoutes from "./routes/templates.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

/**
 * Validate configuration on startup
 */
try {
  validateConfig();
  log.info("Configuration validated successfully");
} catch (error) {
  log.error("Configuration validation failed", error);
  process.exit(1);
}

/**
 * Create Express application
 */
const app: Application = express();
const PORT = emailConfig.service.port;

/**
 * Swagger API documentation
 */
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));

/**
 * Security & Middleware
 */
app.use(helmet()); // Security headers
app.use(cors({ origin: emailConfig.service.corsOrigin })); // CORS
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(requestLogger); // Request logging

/**
 * Routes
 */
app.use(healthRoutes); // Health check routes
app.use(renderRoutes); // Email rendering routes
app.use(templatesRoutes); // Templates listing routes

/**
 * Error Handlers (must be last)
 */
app.use(notFoundHandler); // 404 handler
app.use(errorHandler); // Global error handler

/**
 * Start server
 */
const server = app.listen(PORT, () => {
  log.info("Email templates service started", {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    service: emailConfig.service.name,
    version: emailConfig.service.version,
  });

  log.info("Available endpoints:", {
    health: `http://localhost:${PORT}/health`,
    render: `http://localhost:${PORT}/api/v1/render`,
    templates: `http://localhost:${PORT}/api/v1/templates`,
  });
});

/**
 * Graceful shutdown
 */
const gracefulShutdown = (signal: string) => {
  log.info(`${signal} received, shutting down gracefully`);

  server.close(() => {
    log.info("Server closed");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    log.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

/**
 * Handle uncaught errors
 */
process.on("uncaughtException", (error: Error) => {
  log.error("Uncaught exception", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  log.error("Unhandled rejection", reason as Error);
  process.exit(1);
});

export default app;
