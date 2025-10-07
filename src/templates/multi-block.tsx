/**
 * Multi-Block Email Template
 *
 * Dynamic template that renders any number of blocks with responsive layout.
 */

import { Container, Section, Row, Column } from "@react-email/components";
import { BaseLayout } from "../components/layout/BaseLayout/BaseLayout";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import {
  ContentBlock,
  TextBlock,
  ImageBlock,
  DividerBlock,
} from "../components/blocks";
import { MultiBlockEmailRequest, EmailBlock } from "../types/email.types";

/**
 * Render a single block based on its type
 */
const renderBlock = (block: EmailBlock | undefined, index: number) => {
  if (!block) {
    return null;
  }

  const key = block.id || `block-${index}`;

  switch (block.type) {
    case "content":
      return <ContentBlock key={key} {...block} />;
    case "text":
      return <TextBlock key={key} {...block} />;
    case "image":
      return <ImageBlock key={key} {...block} />;
    case "divider":
      return <DividerBlock key={key} {...block} />;
    default:
      return null;
  }
};

/**
 * Render blocks with responsive layout
 * - 1 block: full width
 * - 2 blocks: 50/50 split
 * - 3+ blocks: render in sequence (can be customized for grid)
 */
const renderBlocksLayout = (blocks: EmailBlock[]) => {
  if (blocks.length === 1) {
    // Single block - full width
    return renderBlock(blocks[0], 0);
  }

  if (blocks.length === 2) {
    // Two blocks - side by side
    return (
      <Section>
        <Row>
          <Column className="w-[50%] pr-2">{renderBlock(blocks[0], 0)}</Column>
          <Column className="w-[50%] pl-2">{renderBlock(blocks[1], 1)}</Column>
        </Row>
      </Section>
    );
  }

  // 3+ blocks - render in sequence
  // You can customize this to create grid layouts if needed
  return (
    <>
      {blocks.map((block, index) => (
        <div key={block.id || `block-${index}`}>
          {renderBlock(block, index)}
        </div>
      ))}
    </>
  );
};

export interface MultiBlockTemplateProps {
  data: MultiBlockEmailRequest;
}

export const MultiBlockTemplate = ({ data }: MultiBlockTemplateProps) => {
  const { subject, preview, blocks } = data;

  return (
    <BaseLayout title={subject} preview={preview}>
      <Header />
      <Container>{renderBlocksLayout(blocks)}</Container>
      <Footer />
    </BaseLayout>
  );
};
