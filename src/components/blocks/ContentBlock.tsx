/**
 * Content Block Component
 *
 * Full-featured block with image, title, text, and button.
 */

import { Section, Img, Heading, Text, Button } from "@react-email/components";
import { ContentBlock as ContentBlockType } from "../../types/email.types";

interface ContentBlockProps extends Omit<ContentBlockType, "type"> {
  className?: string;
}

export const ContentBlock = ({
  title,
  text,
  imageUrl,
  imageWidth,
  imageHeight,
  imageAlt,
  buttonUrl,
  buttonText,
  className = "",
}: ContentBlockProps) => {
  return (
    <Section
      className={`bg-[#8e4fd91a] rounded-lg p-8 text-center ${className}`}
    >
      <Img
        className="mx-auto"
        src={imageUrl}
        width={imageWidth}
        height={imageHeight}
        alt={imageAlt}
      />
      <Heading className="text-[22px] font-semibold mb-4 text-text">
        {title}
      </Heading>
      <Text className="text-[14px] leading-[20px] text-text mb-6">{text}</Text>
      <Button
        href={buttonUrl}
        className="bg-primary py-3 px-6 rounded-[32px] text-text font-semibold text-[14px]"
      >
        {buttonText}
      </Button>
    </Section>
  );
};
