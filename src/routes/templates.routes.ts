/**
 * Templates Routes
 *
 * Routes for listing available templates.
 */

import { Router, Request, Response } from "express";
import { emailRenderer } from "../services/renderer";
import { emailConfig } from "../config/email.config";

const templatesRoutes = Router();

/**
 * @openapi
 * /api/v1/email-templates/templates:
 *   get:
 *     summary: List available templates
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: Available templates
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TemplatesListResponse'
 */
templatesRoutes.get("/api/v1/email-templates/templates", (req: Request, res: Response) => {
  const templates = emailRenderer.getAvailableTemplates();

  res.json({
    templates: templates.map((name) => ({
      name,
      description: getTemplateDescription(name),
      config: getTemplateConfig(name),
    })),
  });
});

/**
 * @openapi
 * /api/v1/email-templates/templates/{name}:
 *   get:
 *     summary: Get specific template info
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["multi-block", "verification-code"]
 *         description: Template name
 *     responses:
 *       200:
 *         description: Template details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TemplateDetailResponse'
 *       404:
 *         description: Template not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
templatesRoutes.get(
  "/api/v1/email-templates/templates/:name",
  (req: Request, res: Response) => {
    const templateName = req.params.name;

    if (!emailRenderer.isTemplateAvailable(templateName)) {
      return res.status(404).json({
        error: {
          code: "TEMPLATE_NOT_FOUND",
          message: `Template '${templateName}' not found`,
        },
      });
    }

    res.json({
      name: templateName,
      description: getTemplateDescription(templateName),
      config: getTemplateConfig(templateName),
      exampleRequest: getTemplateExample(templateName),
    });
  }
);

/**
 * Helper: Get template description
 */
function getTemplateDescription(name: string | undefined): string {
  if (!name) {
    return "No description available";
  }
  const descriptions: Record<string, string> = {
    "multi-block":
      "Dynamic template supporting multiple content blocks with flexible layout",
    "verification-code":
      "Clean template for displaying verification codes and OTPs",
  };

  return descriptions[name] || "No description available";
}

/**
 * Helper: Get template configuration
 */
function getTemplateConfig(name: string | undefined): Record<string, unknown> {
  if (!name) {
    return {};
  }
  const configs: Record<string, Record<string, unknown>> = {
    "multi-block": {
      maxBlocks: emailConfig.templates.multiBlock.maxBlocks,
      minBlocks: emailConfig.templates.multiBlock.minBlocks,
      allowedBlockTypes: emailConfig.templates.multiBlock.allowedBlockTypes,
    },
    "verification-code": {
      codeLength: emailConfig.templates.verificationCode.codeLength,
      expiryMinutes: emailConfig.templates.verificationCode.expiryMinutes,
    },
  };

  return configs[name] || {};
}

/**
 * Helper: Get template example request
 */
function getTemplateExample(name: string | undefined): Record<string, unknown> {
  if (!name) {
    return {};
  }
  const examples: Record<string, Record<string, unknown>> = {
    "multi-block": {
      template: "multi-block",
      subject: "Welcome to Anora",
      preview: "Get started today",
      blocks: [
        {
          type: "content",
          title: "Welcome!",
          text: "We are glad to have you here",
          imageUrl: "https://example.com/image.png",
          imageAlt: "Welcome",
          imageWidth: 100,
          imageHeight: 100,
          buttonText: "Get Started",
          buttonUrl: "https://anora.app",
        },
      ],
    },
    "verification-code": {
      template: "verification-code",
      subject: "Your verification code",
      preview: "Use this code to verify",
      code: "123456",
      expiryMinutes: 15,
      recipientName: "John Doe",
    },
  };

  return examples[name] || {};
}

export default templatesRoutes;
