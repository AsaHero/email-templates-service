/**
 * Email Renderer Service
 *
 * Main service for rendering email templates.
 */

import { emailValidator } from "../validation";
import { templateRegistry } from "../../templates/registry";
import { log } from "../../utils/logger.utils";
import { RenderingError } from "../../utils/errors.utils";
import { EmailRequest, EmailResponse } from "../../types/email.types";

/**
 * Email Renderer Service
 */
export class EmailRendererService {
  /**
   * Render an email from request data
   */
  async renderEmail(data: unknown): Promise<EmailResponse> {
    const startTime = Date.now();

    try {
      // Step 1: Validate the request
      log.debug("Validating email request");
      const validatedData = emailValidator.validate(data) as EmailRequest;

      // Step 2: Render the template
      log.debug(`Rendering template: ${validatedData.template}`);
      const html = await templateRegistry.render(
        validatedData.template,
        validatedData
      );

      // Step 3: Create response
      const response: EmailResponse = {
        html,
        subject: validatedData.subject,
        preview: validatedData.preview,
        template: validatedData.template,
        metadata: validatedData.metadata,
      };

      const duration = Date.now() - startTime;
      log.info("Email rendered successfully", {
        template: validatedData.template,
        duration: `${duration}ms`,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      log.error("Email rendering failed", error, {
        duration: `${duration}ms`,
      });

      if (error instanceof Error) {
        throw error;
      }

      throw new RenderingError("Unknown rendering error");
    }
  }

  /**
   * Get list of available templates
   */
  getAvailableTemplates(): string[] {
    return templateRegistry.list();
  }

  /**
   * Check if template exists
   */
  isTemplateAvailable(templateName: string | undefined): boolean {
    if (!templateName) {
      return false;
    }
    return templateRegistry.has(templateName);
  }
}

/**
 * Singleton instance
 */
export const emailRenderer = new EmailRendererService();
