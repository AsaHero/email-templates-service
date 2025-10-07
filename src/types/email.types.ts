/**
 * Core Email Types
 *
 * Defines the fundamental types used throughout the email rendering system.
 */

import { ReactNode } from "react";

// ============================================
// Block Types
// ============================================

/**
 * Base interface for all block types
 */
export interface BaseBlock {
  type: BlockType;
  id?: string;
}

/**
 * Content block with image, title, text, and button
 */
export interface ContentBlock extends BaseBlock {
  type: "content";
  title: string | ReactNode;
  text: string | ReactNode;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  buttonText: string;
  buttonUrl: string;
}

/**
 * Verification code block
 */
export interface CodeBlock extends BaseBlock {
  type: "code";
  code: string;
  expiryMinutes?: number;
  title?: string;
  subtitle?: string;
}

/**
 * Simple text block
 */
export interface TextBlock extends BaseBlock {
  type: "text";
  content: string | ReactNode;
  align?: "left" | "center" | "right";
  size?: "small" | "medium" | "large";
}

/**
 * Image-only block
 */
export interface ImageBlock extends BaseBlock {
  type: "image";
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  link?: string;
}

/**
 * Horizontal divider block
 */
export interface DividerBlock extends BaseBlock {
  type: "divider";
  color?: string;
  thickness?: number;
}

/**
 * Union type of all possible block types
 */
export type EmailBlock =
  | ContentBlock
  | CodeBlock
  | TextBlock
  | ImageBlock
  | DividerBlock;

/**
 * Block type discriminator
 */
export type BlockType = EmailBlock["type"];

// ============================================
// Email Request/Response Types
// ============================================

/**
 * Base email request interface
 */
export interface BaseEmailRequest {
  template: string;
  subject: string;
  preview: string;
  metadata?: EmailMetadata;
}

/**
 * Multi-block email request
 */
export interface MultiBlockEmailRequest extends BaseEmailRequest {
  template: "multi-block";
  blocks: EmailBlock[];
}

/**
 * Verification code email request
 */
export interface VerificationCodeEmailRequest extends BaseEmailRequest {
  template: "verification-code";
  code: string;
}

/**
 * Union type of all email request types
 */
export type EmailRequest =
  | MultiBlockEmailRequest
  | VerificationCodeEmailRequest;

/**
 * Email metadata for tracking and customization
 */
export interface EmailMetadata {
  userId?: string;
  language?: string;
  timezone?: string;
  customData?: Record<string, unknown>;
}

/**
 * Successful email response
 */
export interface EmailResponse {
  html: string;
  subject: string;
  preview: string;
  template: string;
  metadata?: EmailMetadata;
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ValidationError[];
  };
}

/**
 * Validation error detail
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// ============================================
// Template Types
// ============================================

/**
 * Template information for listing
 */
export interface TemplateInfo {
  name: string;
  description: string;
  maxBlocks?: number;
  minBlocks?: number;
  allowedBlockTypes?: BlockType[];
  requiredFields: string[];
  optionalFields: string[];
  exampleRequest: Record<string, unknown>;
}

/**
 * Template list response
 */
export interface TemplateListResponse {
  templates: TemplateInfo[];
}

// ============================================
// Rendering Types
// ============================================

/**
 * Render context passed to templates
 */
export interface RenderContext {
  config: {
    baseUrl: string;
    fontsUrl: string;
    imagesUrl: string;
  };
  metadata?: EmailMetadata;
}

/**
 * Template render function signature
 */
export type TemplateRenderFunction<T extends EmailRequest = EmailRequest> = (
  data: T,
  context: RenderContext
) => Promise<string>;
