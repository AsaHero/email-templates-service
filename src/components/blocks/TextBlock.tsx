/**
 * Text Block Component
 *
 * Simple text-only block with alignment and size options.
 */

import { Section, Text } from "@react-email/components";
import { TextBlock as TextBlockType } from "../../types/email.types";

interface TextBlockProps extends Omit<TextBlockType, "type"> {
  className?: string;
}

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const sizeClasses = {
  small: "text-[12px] leading-[18px]",
  medium: "text-[14px] leading-[20px]",
  large: "text-[16px] leading-[24px]",
};

export const TextBlock = ({
  content,
  align = "left",
  size = "medium",
  className = "",
}: TextBlockProps) => {
  const alignClass = alignmentClasses[align];
  const sizeClass = sizeClasses[size];

  return (
    <Section className={`py-4 ${className}`}>
      <Text className={`${sizeClass} ${alignClass} text-text m-0`}>
        {content}
      </Text>
    </Section>
  );
};
