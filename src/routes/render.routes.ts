/**
 * Email Rendering Routes
 *
 * Routes for rendering email templates.
 */

import { Router, Request, Response, NextFunction } from "express";
import { emailRenderer } from "../services/renderer";
import { renderRateLimiter } from "../middleware";
import { log } from "../utils/logger.utils";

const renderRoutes = Router();

/**
 * @openapi
 * /api/v1/email-templates/render:
 *   post:
 *     summary: Render email template (by body.template)
 *     tags: [Render]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *           examples:
 *             multiBlock:
 *               summary: Multi-block example
 *               value:
 *                 template: "multi-block"
 *                 subject: "Welcome to Anora"
 *                 preview: "Get started today"
 *                 blocks:
 *                   - type: "content"
 *                     title: "Welcome!"
 *                     text: "We are glad to have you here"
 *                     imageUrl: "https://example.com/image.png"
 *                     imageAlt: "Welcome"
 *                     imageWidth: 100
 *                     imageHeight: 100
 *                     buttonText: "Get Started"
 *                     buttonUrl: "https://anora.app"
 *             verification:
 *               summary: Verification code example
 *               value:
 *                 template: "verification-code"
 *                 subject: "Your verification code"
 *                 preview: "Use this code to verify"
 *                 code: "123456"
 *                 expiryMinutes: 15
 *                 recipientName: "John Doe"
 *     responses:
 *       200:
 *         description: Rendered email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailResponse'
 *       400:
 *         description: Validation or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Template not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Rate limited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
renderRoutes.post(
  "/api/v1/email-templates/render",
  renderRateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      log.debug("Rendering email request", {
        template: req.body.template,
      });

      const response = await emailRenderer.renderEmail(req.body);

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/email-templates/render/{template}:
 *   post:
 *     summary: Render email by path template (overrides body.template)
 *     tags: [Render]
 *     parameters:
 *       - in: path
 *         name: template
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["verification-code"]
 *         description: Template name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
  *           examples:
 *             verification:
 *               summary: Verification code example
 *               value:
 *                 template: "verification-code"
 *                 subject: "Your verification code"
 *                 preview: "Use this code to verify"
 *                 code: "123456"
 *     responses:
 *       200:
 *         description: Rendered email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailResponse'
 *       400:
 *         description: Validation or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Template not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Rate limited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
renderRoutes.post(
  "/api/v1/email-templates/render/:template",
  renderRateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templateName = req.params.template;

      log.debug("Rendering email with specific template", {
        template: templateName,
      });

      // Add template to body if not present
      const requestData = {
        ...req.body,
        template: templateName,
      };

      const response = await emailRenderer.renderEmail(requestData);

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default renderRoutes;
