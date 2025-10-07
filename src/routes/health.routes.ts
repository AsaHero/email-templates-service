/**
 * Health Check Routes
 *
 * Routes for service health checks.
 */

import { Router, Request, Response } from "express";
import { emailConfig } from "../config/email.config";

const healthRoutes = Router();

/**
 * @openapi
 * /api/v1/email-templates/health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
healthRoutes.get(
  "/api/v1/email-templates/health",
  (req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: emailConfig.service.name,
      version: emailConfig.service.version,
    });
  }
);

/**
 * @openapi
 * /api/v1/email-templates/health/ready:
 *   get:
 *     summary: Readiness check (Kubernetes)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadinessResponse'
 */
healthRoutes.get(
  "/api/v1/email-templates/health/ready",
  (req: Request, res: Response) => {
    // Add checks for dependencies if needed
    // For now, always ready if server is running
    res.json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  }
);

/**
 * @openapi
 * /api/v1/email-templates/health/live:
 *   get:
 *     summary: Liveness check (Kubernetes)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LivenessResponse'
 */
healthRoutes.get(
  "/api/v1/email-templates/health/live",
  (req: Request, res: Response) => {
    res.json({
      status: "alive",
      timestamp: new Date().toISOString(),
    });
  }
);

export default healthRoutes;
