export interface ContentBlock {
  title: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  buttonText: string;
  buttonUrl: string;
}

export interface EmailRequest {
  subject: string;
  preview: string;
  blocks: ContentBlock[];
}

export interface EmailResponse {
  html: string;
  subject: string;
  preview: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}
