// services/emailRenderer.ts
import * as React from 'react';
import { render } from '@react-email/render';
import { AnoraSingle } from '../emails/anora-one-block';
import { AnoraTwoColumns } from '../emails/anora-two-blocks';
import { AnoraThreeColumns } from '../emails/anora-three-blocks';
import { EmailRequest, ContentBlock } from '../types/email';

class EmailRenderer {
  async renderEmail(emailData: EmailRequest): Promise<string> {
    const { subject, preview, blocks } = emailData;

    try {
      let html: string;

      switch (blocks.length) {
        case 1:
          html = await this.renderSingleBlock(subject, preview, blocks[0]);
          break;
        case 2:
          html = await this.renderTwoBlocks(subject, preview, blocks);
          break;
        case 3:
          html = await this.renderThreeBlocks(subject, preview, blocks);
          break;
        default:
          throw new Error(`Unsupported number of blocks: ${blocks.length}`);
      }

      return html;
    } catch (error) {
      console.error('Failed to render email:', error);
      throw new Error(`Email rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async renderSingleBlock(title: string, preview: string, block: ContentBlock): Promise<string> {
    const emailComponent = AnoraSingle({
      title,
      preview,
      content: {
        title: this.parseHtmlString(block.title),
        text: this.parseHtmlString(block.text),
        imageUrl: block.imageUrl,
        imageAlt: block.imageAlt,
        imageWidth: block.imageWidth,
        imageHeight: block.imageHeight,
        buttonText: block.buttonText,
        buttonUrl: block.buttonUrl,
      },
    });

    return await render(emailComponent);
  }

  private async renderTwoBlocks(title: string, preview: string, blocks: ContentBlock[]): Promise<string> {
    const emailComponent = AnoraTwoColumns({
      title,
      preview,
      content: blocks.map((block) => ({
        title: this.parseHtmlString(block.title),
        text: this.parseHtmlString(block.text),
        imageUrl: block.imageUrl,
        imageAlt: block.imageAlt,
        imageWidth: block.imageWidth,
        imageHeight: block.imageHeight,
        buttonText: block.buttonText,
        buttonUrl: block.buttonUrl,
      })),
    });

    return await render(emailComponent);
  }

  private async renderThreeBlocks(title: string, preview: string, blocks: ContentBlock[]): Promise<string> {
    const emailComponent = AnoraThreeColumns({
      title,
      preview,
      blocks: blocks.slice(0, 2).map((block) => ({
        title: this.parseHtmlString(block.title),
        text: this.parseHtmlString(block.text),
        imageUrl: block.imageUrl,
        imageAlt: block.imageAlt,
        imageWidth: block.imageWidth,
        imageHeight: block.imageHeight,
        buttonText: block.buttonText,
        buttonUrl: block.buttonUrl,
      })),
      single: {
        title: this.parseHtmlString(blocks[2].title),
        text: this.parseHtmlString(blocks[2].text),
        imageUrl: blocks[2].imageUrl,
        imageAlt: blocks[2].imageAlt,
        imageWidth: blocks[2].imageWidth,
        imageHeight: blocks[2].imageHeight,
        buttonText: blocks[2].buttonText,
        buttonUrl: blocks[2].buttonUrl,
      },
    });

    return await render(emailComponent);
  }

  private parseHtmlString(content: string): React.ReactNode {
    // For simple HTML strings, we'll use dangerouslySetInnerHTML to avoid JSX compilation issues
    // This is safe since we control the HTML content coming from our backend

    // Check if content contains HTML tags
    const hasHtmlTags = /<[^>]*>/g.test(content);

    if (hasHtmlTags) {
      // Return a span with dangerouslySetInnerHTML for HTML content
      return {
        $typeof: Symbol.for('react.element'),
        type: 'span',
        props: {
          dangerouslySetInnerHTML: { __html: content },
        },
        key: null,
        ref: null,
      } as React.ReactElement;
    }

    // Return plain text as-is
    return content;
  }
}

export const emailRenderer = new EmailRenderer();
