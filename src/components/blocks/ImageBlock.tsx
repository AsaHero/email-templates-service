/**
 * Image Block Component
 *
 * Image-only block with optional link.
 */

import { Section, Img, Link } from "@react-email/components";
import { ImageBlock as ImageBlockType } from "../../types/email.types";

interface ImageBlockProps extends Omit<ImageBlockType, "type"> {
  className?: string;
}

export const ImageBlock = ({
  imageUrl,
  imageAlt,
  imageWidth,
  imageHeight,
  link,
  className = "",
}: ImageBlockProps) => {
  const image = (
    <Img
      src={imageUrl}
      alt={imageAlt}
      width={imageWidth}
      height={imageHeight}
      className="mx-auto rounded-lg"
    />
  );

  return (
    <Section className={`py-4 text-center ${className}`}>
      {link ? <Link href={link}>{image}</Link> : image}
    </Section>
  );
};
