/**
 * Simple Validator Service
 *
 * Lightweight validation without external dependencies.
 */

import { ValidationErrorException } from "../../utils/errors.utils";
import { ValidationError, EmailRequest } from "../../types/email.types";
import { emailConfig } from "../../config/email.config";
import { log } from "../../utils/logger.utils";

/**
 * Simple validation helpers
 */
const validators = {
  isString: (value: unknown): value is string => typeof value === "string",

  isNumber: (value: unknown): value is number => typeof value === "number",

  isUrl: (value: unknown): boolean => {
    if (typeof value !== "string") return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  isNonEmptyString: (value: unknown): boolean => {
    return typeof value === "string" && value.trim().length > 0;
  },

  isPositiveNumber: (value: unknown): boolean => {
    return typeof value === "number" && value > 0;
  },

  isInRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },
};

/**
 * Email Validator Service
 */
export class EmailValidatorService {
  /**
   * Validate email request
   */
  validate(data: unknown): EmailRequest {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      throw new ValidationErrorException("Request must be an object");
    }

    const request = data as Record<string, unknown>;

    // Validate template
    if (!validators.isNonEmptyString(request.template)) {
      errors.push({ field: "template", message: "Template is required" });
    }

    // Validate subject
    if (!validators.isNonEmptyString(request.subject)) {
      errors.push({ field: "subject", message: "Subject is required" });
    } else if ((request.subject as string).length > 200) {
      errors.push({
        field: "subject",
        message: "Subject cannot exceed 200 characters",
      });
    }

    // Validate preview
    if (!validators.isNonEmptyString(request.preview)) {
      errors.push({ field: "preview", message: "Preview is required" });
    } else if ((request.preview as string).length > 150) {
      errors.push({
        field: "preview",
        message: "Preview cannot exceed 150 characters",
      });
    }

    // If there are errors, throw
    if (errors.length > 0) {
      throw new ValidationErrorException("Validation failed", errors);
    }

    const template = request.template as string;

    // Validate based on template type
    switch (template) {
      case "multi-block":
        return this.validateMultiBlock(request);
      case "verification-code":
        return this.validateVerificationCode(request);
      default:
        throw new ValidationErrorException(`Unknown template: ${template}`);
    }
  }

  /**
   * Validate multi-block email
   */
  private validateMultiBlock(request: Record<string, unknown>): EmailRequest {
    const errors: ValidationError[] = [];

    // Validate blocks array
    if (!Array.isArray(request.blocks)) {
      errors.push({ field: "blocks", message: "Blocks must be an array" });
      throw new ValidationErrorException("Validation failed", errors);
    }

    const blocks = request.blocks as Array<Record<string, unknown>>;

    if (blocks.length === 0) {
      errors.push({
        field: "blocks",
        message: "At least one block is required",
      });
    }

    if (blocks.length > emailConfig.templates.multiBlock.maxBlocks) {
      errors.push({
        field: "blocks",
        message: `Maximum ${emailConfig.templates.multiBlock.maxBlocks} blocks allowed`,
      });
    }

    // Validate each block
    blocks.forEach((block, index) => {
      this.validateBlock(block, index, errors);
    });

    if (errors.length > 0) {
      throw new ValidationErrorException(
        "Multi-block validation failed",
        errors
      );
    }

    log.info("Multi-block email validated", { blockCount: blocks.length });

    return {
      template: "multi-block",
      subject: request.subject as string,
      preview: request.preview as string,
      blocks: blocks as any[],
      metadata: request.metadata as any,
    };
  }

  /**
   * Validate individual block
   */
  private validateBlock(
    block: Record<string, unknown>,
    index: number,
    errors: ValidationError[]
  ): void {
    const prefix = `blocks.${index}`;

    if (!validators.isNonEmptyString(block.type)) {
      errors.push({
        field: `${prefix}.type`,
        message: "Block type is required",
      });
      return;
    }

    const type = block.type as string;

    switch (type) {
      case "content":
        this.validateContentBlock(block, prefix, errors);
        break;
      case "text":
        this.validateTextBlock(block, prefix, errors);
        break;
      case "image":
        this.validateImageBlock(block, prefix, errors);
        break;
      case "divider":
        // Divider has no required fields beyond type
        break;
      default:
        errors.push({
          field: `${prefix}.type`,
          message: `Unknown block type: ${type}`,
        });
    }
  }

  /**
   * Validate content block
   */
  private validateContentBlock(
    block: Record<string, unknown>,
    prefix: string,
    errors: ValidationError[]
  ): void {
    if (!validators.isNonEmptyString(block.title)) {
      errors.push({ field: `${prefix}.title`, message: "Title is required" });
    }

    if (!validators.isNonEmptyString(block.text)) {
      errors.push({ field: `${prefix}.text`, message: "Text is required" });
    }

    if (!validators.isUrl(block.imageUrl)) {
      errors.push({
        field: `${prefix}.imageUrl`,
        message: "Valid image URL is required",
      });
    }

    if (!validators.isNonEmptyString(block.imageAlt)) {
      errors.push({
        field: `${prefix}.imageAlt`,
        message: "Image alt text is required",
      });
    }

    if (!validators.isPositiveNumber(block.imageWidth)) {
      errors.push({
        field: `${prefix}.imageWidth`,
        message: "Valid image width is required",
      });
    }

    if (!validators.isPositiveNumber(block.imageHeight)) {
      errors.push({
        field: `${prefix}.imageHeight`,
        message: "Valid image height is required",
      });
    }

    if (!validators.isNonEmptyString(block.buttonText)) {
      errors.push({
        field: `${prefix}.buttonText`,
        message: "Button text is required",
      });
    }

    if (!validators.isUrl(block.buttonUrl)) {
      errors.push({
        field: `${prefix}.buttonUrl`,
        message: "Valid button URL is required",
      });
    }
  }

  /**
   * Validate code block
   */
  private validateCodeBlock(
    block: Record<string, unknown>,
    prefix: string,
    errors: ValidationError[]
  ): void {
    if (!validators.isNonEmptyString(block.code)) {
      errors.push({ field: `${prefix}.code`, message: "Code is required" });
    } else {
      const code = block.code as string;
      if (code.length !== emailConfig.templates.verificationCode.codeLength) {
        errors.push({
          field: `${prefix}.code`,
          message: `Code must be ${emailConfig.templates.verificationCode.codeLength} characters`,
        });
      }
      if (!/^[0-9]+$/.test(code)) {
        errors.push({
          field: `${prefix}.code`,
          message: "Code must contain only numbers",
        });
      }
    }
  }

  /**
   * Validate text block
   */
  private validateTextBlock(
    block: Record<string, unknown>,
    prefix: string,
    errors: ValidationError[]
  ): void {
    if (!validators.isNonEmptyString(block.content)) {
      errors.push({
        field: `${prefix}.content`,
        message: "Content is required",
      });
    }
  }

  /**
   * Validate image block
   */
  private validateImageBlock(
    block: Record<string, unknown>,
    prefix: string,
    errors: ValidationError[]
  ): void {
    if (!validators.isUrl(block.imageUrl)) {
      errors.push({
        field: `${prefix}.imageUrl`,
        message: "Valid image URL is required",
      });
    }

    if (!validators.isNonEmptyString(block.imageAlt)) {
      errors.push({
        field: `${prefix}.imageAlt`,
        message: "Image alt text is required",
      });
    }

    if (!validators.isPositiveNumber(block.imageWidth)) {
      errors.push({
        field: `${prefix}.imageWidth`,
        message: "Valid image width is required",
      });
    }

    if (!validators.isPositiveNumber(block.imageHeight)) {
      errors.push({
        field: `${prefix}.imageHeight`,
        message: "Valid image height is required",
      });
    }
  }

  /**
   * Validate verification code email
   */
  private validateVerificationCode(
    request: Record<string, unknown>
  ): EmailRequest {
    const errors: ValidationError[] = [];

    if (!validators.isNonEmptyString(request.code)) {
      errors.push({ field: "code", message: "Code is required" });
    } else {
      const code = request.code as string;
      if (code.length !== emailConfig.templates.verificationCode.codeLength) {
        errors.push({
          field: "code",
          message: `Code must be ${emailConfig.templates.verificationCode.codeLength} characters`,
        });
      }
      if (!/^[0-9]+$/.test(code)) {
        errors.push({
          field: "code",
          message: "Code must contain only numbers",
        });
      }
    }

    if (errors.length > 0) {
      throw new ValidationErrorException(
        "Verification code validation failed",
        errors
      );
    }

    log.info("Verification code email validated");

    return {
      template: "verification-code",
      subject: request.subject as string,
      preview: request.preview as string,
      code: request.code as string,
      metadata: request.metadata as any,
    };
  }
}

/**
 * Singleton instance
 */
export const emailValidator = new EmailValidatorService();
