/**
 * Template Registry
 *
 * Simple registry for email templates.
 */

import * as React from "react";
import { render } from "@react-email/render";
import { log } from "../utils/logger.utils";
import { TemplateNotFoundError } from "../utils/errors.utils";
import { EmailRequest } from "../types/email.types";
import { MultiBlockTemplate } from "./multi-block";
import { VerificationCodeTemplate } from "./verification-code";

/**
 * Template render function type
 */
type TemplateRenderer = (data: EmailRequest) => Promise<string>;

/**
 * Template Registry
 */
class TemplateRegistry {
  private templates: Map<string, TemplateRenderer> = new Map();

  constructor() {
    this.registerDefaults();
  }

  /**
   * Register default templates
   */
  private registerDefaults(): void {
    // Multi-block template
    this.register("multi-block", async (data) => {
      const element = React.createElement(MultiBlockTemplate, {
        data: data as any,
      });
      return await render(element);
    });

    // Verification code template
    this.register("verification-code", async (data) => {
      const element = React.createElement(VerificationCodeTemplate, {
        data: data as any,
      });
      return await render(element);
    });

    log.info("Default templates registered", {
      templates: Array.from(this.templates.keys()),
    });
  }

  /**
   * Register a template
   */
  register(name: string, renderer: TemplateRenderer): void {
    this.templates.set(name, renderer);
    log.debug(`Template registered: ${name}`);
  }

  /**
   * Get a template renderer
   */
  get(name: string): TemplateRenderer {
    const renderer = this.templates.get(name);

    if (!renderer) {
      throw new TemplateNotFoundError(name);
    }

    return renderer;
  }

  /**
   * Check if template exists
   */
  has(name: string): boolean {
    return this.templates.has(name);
  }

  /**
   * Get all template names
   */
  list(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Render a template
   */
  async render(templateName: string, data: EmailRequest): Promise<string> {
    const startTime = Date.now();

    try {
      const renderer = this.get(templateName);
      const html = await renderer(data);

      const duration = Date.now() - startTime;
      log.emailRender(templateName, true, duration);

      return html;
    } catch (error) {
      const duration = Date.now() - startTime;
      log.emailRender(templateName, false, duration, {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }
}

/**
 * Singleton instance
 */
export const templateRegistry = new TemplateRegistry();
