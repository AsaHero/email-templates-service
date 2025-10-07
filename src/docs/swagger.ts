// src/docs/swagger.ts
import { emailConfig } from "../config/email.config";
import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Anora Email Templates Service",
      version: "2.0.0",
      description: "Email rendering API server for Anora emails",
    },
    servers: [
      {
        url: `http://localhost:${emailConfig.service.port}`,
        description: "Local",
      },
      { url: `https://dev.anora.app`, description: "Development" },
      { url: `https://anora.app`, description: "Production" },
    ],
    components: {
      schemas: {
        // ===== Common / Errors =====
        ValidationError: {
          type: "object",
          properties: {
            field: { type: "string", example: "blocks[0].imageUrl" },
            message: { type: "string", example: "Must be a valid URL" },
            value: { description: "Offending value", nullable: true },
          },
          required: ["field", "message"],
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: { type: "string", example: "Invalid request payload" },
                details: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ValidationError" },
                },
              },
              required: ["code", "message"],
            },
          },
          required: ["error"],
        },

        // ===== Email DTOs =====
        EmailMetadata: {
          type: "object",
          properties: {
            userId: { type: "string", example: "user_123" },
            language: { type: "string", example: "en" },
            timezone: { type: "string", example: "Asia/Tashkent" },
            customData: {
              type: "object",
              additionalProperties: true,
              example: { campaign: "welcome", abVariant: "B" },
            },
          },
          additionalProperties: false,
        },

        // One concrete block type you’re using now ("content").
        // Add more block variants later and make EmailBlock a oneOf.
        EmailBlock: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["content"], example: "content" },
            title: { type: "string", example: "Welcome!" },
            text: { type: "string", example: "We are glad to have you here" },
            imageUrl: {
              type: "string",
              format: "uri",
              example: "https://example.com/image.png",
            },
            imageAlt: { type: "string", example: "Welcome" },
            imageWidth: { type: "integer", minimum: 1, example: 100 },
            imageHeight: { type: "integer", minimum: 1, example: 100 },
            buttonText: { type: "string", example: "Get Started" },
            buttonUrl: {
              type: "string",
              format: "uri",
              example: "https://anora.app",
            },
          },
          required: [
            "type",
            "title",
            "text",
            "imageUrl",
            "imageAlt",
            "imageWidth",
            "imageHeight",
            "buttonText",
            "buttonUrl",
          ],
          additionalProperties: false,
        },

        BaseEmailRequest: {
          type: "object",
          properties: {
            template: { type: "string" }, // specialized in children
            subject: { type: "string", example: "Your verification code" },
            preview: { type: "string", example: "Use this code to verify" },
            metadata: { $ref: "#/components/schemas/EmailMetadata" },
          },
          required: ["template", "subject", "preview"],
          additionalProperties: false,
        },

        MultiBlockEmailRequest: {
          allOf: [
            { $ref: "#/components/schemas/BaseEmailRequest" },
            {
              type: "object",
              properties: {
                template: { type: "string", enum: ["multi-block"] },
                blocks: {
                  type: "array",
                  items: { $ref: "#/components/schemas/EmailBlock" },
                  minItems: 1,
                },
              },
              required: ["template", "blocks"],
            },
          ],
          example: {
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
            metadata: { language: "en" },
          },
        },

        VerificationCodeEmailRequest: {
          allOf: [
            { $ref: "#/components/schemas/BaseEmailRequest" },
            {
              type: "object",
              properties: {
                template: { type: "string", enum: ["verification-code"] },
                code: { type: "string", example: "123456" },
                expiryMinutes: { type: "integer", example: 15 },
                recipientName: { type: "string", example: "John Doe" },
              },
              required: ["template", "code"],
            },
          ],
          example: {
            template: "verification-code",
            subject: "Your verification code",
            preview: "Use this code to verify",
            code: "123456",
            expiryMinutes: 15,
            recipientName: "John Doe",
            metadata: { language: "en" },
          },
        },

        EmailRequest: {
          oneOf: [
            { $ref: "#/components/schemas/MultiBlockEmailRequest" },
            { $ref: "#/components/schemas/VerificationCodeEmailRequest" },
          ],
          discriminator: {
            propertyName: "template",
            mapping: {
              "multi-block": "#/components/schemas/MultiBlockEmailRequest",
              "verification-code":
                "#/components/schemas/VerificationCodeEmailRequest",
            },
          },
        },

        EmailResponse: {
          type: "object",
          properties: {
            html: { type: "string" },
            subject: { type: "string" },
            preview: { type: "string" },
            template: { type: "string" },
            metadata: { $ref: "#/components/schemas/EmailMetadata" },
          },
          required: ["html", "subject", "preview", "template"],
          example: {
            html: "<!doctype html> ...",
            subject: "Welcome to Anora",
            preview: "Get started today",
            template: "multi-block",
            metadata: { language: "en" },
          },
        },

        // ===== Templates listing DTOs =====
        TemplateInfo: {
          type: "object",
          properties: {
            name: {
              type: "string",
              enum: ["multi-block", "verification-code"],
              example: "multi-block",
            },
            description: {
              type: "string",
              example:
                "Dynamic template supporting multiple content blocks with flexible layout",
            },
            config: {
              type: "object",
              additionalProperties: true,
              example: {
                maxBlocks: 10,
                minBlocks: 1,
                allowedBlockTypes: ["content"],
              },
            },
          },
          required: ["name", "description", "config"],
        },
        TemplatesListResponse: {
          type: "object",
          properties: {
            templates: {
              type: "array",
              items: { $ref: "#/components/schemas/TemplateInfo" },
            },
          },
          required: ["templates"],
        },
        TemplateDetailResponse: {
          type: "object",
          properties: {
            name: { type: "string", example: "multi-block" },
            description: { type: "string" },
            config: {
              type: "object",
              additionalProperties: true,
            },
            exampleRequest: {
              oneOf: [
                { $ref: "#/components/schemas/MultiBlockEmailRequest" },
                { $ref: "#/components/schemas/VerificationCodeEmailRequest" },
              ],
            },
          },
          required: ["name", "description", "config", "exampleRequest"],
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "ok" },
            timestamp: { type: "string", format: "date-time" },
            service: { type: "string" },
            version: { type: "string" },
          },
          required: ["status", "timestamp"],
        },
        ReadinessResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "ready" },
            timestamp: { type: "string", format: "date-time" },
          },
          required: ["status", "timestamp"],
        },
        LivenessResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "alive" },
            timestamp: { type: "string", format: "date-time" },
          },
          required: ["status", "timestamp"],
        },
      },
    },
  },
  apis: ["src/routes/**/*.ts"], // keep your routes glob
});
