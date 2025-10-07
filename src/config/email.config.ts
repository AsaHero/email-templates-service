/**
 * Email Service Configuration
 *
 * Centralized configuration for email templates, rendering, and service limits.
 */

export interface EmailConfig {
  // Service configuration
  service: {
    name: string;
    version: string;
    port: number;
    corsOrigin: string;
  };

  // Template limits and constraints
  templates: {
    multiBlock: {
      name: "multi-block";
      maxBlocks: number;
      minBlocks: number;
      allowedBlockTypes: string[];
    };
    verificationCode: {
      name: "verification-code";
      codeLength: number;
      expiryMinutes: number;
    };
  };

  // Asset URLs
  assets: {
    baseUrl: string;
    fontsUrl: string;
    imagesUrl: string;
  };

  // Rate limiting
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };

  // Logging
  logging: {
    level: string;
    format: "json" | "simple";
  };
}

/**
 * Load and validate email configuration from environment variables
 */
export const emailConfig: EmailConfig = {
  service: {
    name: "anora-email-api",
    version: "2.0.0",
    port: parseInt(process.env.PORT || "3001", 10),
    corsOrigin: process.env.CORS_ORIGIN || "*",
  },

  templates: {
    multiBlock: {
      name: "multi-block",
      maxBlocks: parseInt(process.env.MAX_BLOCKS || "20", 10),
      minBlocks: 1,
      allowedBlockTypes: ["content", "text", "image", "code", "divider"],
    },
    verificationCode: {
      name: "verification-code",
      codeLength: 4,
      expiryMinutes: 15,
    },
  },

  assets: {
    baseUrl: process.env.NEXT_PUBLIC_CDN_HOST
      ? `${process.env.NEXT_PUBLIC_CDN_HOST}/public/emails`
      : "/static",
    fontsUrl: process.env.NEXT_PUBLIC_CDN_HOST
      ? `${process.env.NEXT_PUBLIC_CDN_HOST}/public/static/fonts`
      : "/static/fonts",
    imagesUrl: process.env.NEXT_PUBLIC_CDN_HOST
      ? `${process.env.NEXT_PUBLIC_CDN_HOST}/public/emails`
      : "/static",
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  logging: {
    level:
      process.env.LOG_LEVEL ||
      (process.env.NODE_ENV === "production" ? "info" : "debug"),
    format: process.env.LOG_FORMAT === "json" ? "json" : "simple",
  },
};

/**
 * Template registry - maps template names to their configurations
 */
export const TEMPLATE_NAMES = {
  MULTI_BLOCK: "multi-block",
  VERIFICATION_CODE: "verification-code",
  PASSWORD_RESET: "password-reset",
} as const;

export type TemplateName = (typeof TEMPLATE_NAMES)[keyof typeof TEMPLATE_NAMES];

/**
 * Validate configuration on startup
 */
export function validateConfig(): void {
  const errors: string[] = [];

  if (emailConfig.service.port < 1 || emailConfig.service.port > 65535) {
    errors.push("PORT must be between 1 and 65535");
  }

  if (
    emailConfig.templates.multiBlock.maxBlocks <
    emailConfig.templates.multiBlock.minBlocks
  ) {
    errors.push("MAX_BLOCKS must be greater than or equal to MIN_BLOCKS");
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join("\n")}`);
  }
}
