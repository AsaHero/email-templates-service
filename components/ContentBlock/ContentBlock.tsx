import type { ReactNode } from 'react';
import { Section, Img, Heading, Text, Button } from '@react-email/components';
import { twMerge } from 'tailwind-merge';

export type TContentBlockProps = {
  title: string | ReactNode;
  text: string | ReactNode;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  buttonText: string;
  buttonUrl: string;
  wrapperClassName?: string;
};

export const ContentBlock = ({
  title,
  text,
  imageUrl,
  imageWidth = 50,
  imageHeight = 50,
  imageAlt,
  buttonUrl,
  buttonText,
  wrapperClassName,
}: TContentBlockProps) => {
  return (
    <Section className={twMerge('bg-[#8e4fd91a] rounded-lg p-8 text-center', wrapperClassName)}>
      <Img className="mx-auto" src={imageUrl} width={imageWidth} height={imageHeight} alt={imageAlt} />
      <Heading className="text-[22px] font-semibold mb-4">{title}</Heading>
      <Text className="text-[12px] leading-[18px]">{text}</Text>
      <Button
        href={buttonUrl}
        className="bg-primary py-3 px-6 rounded-[32px] text-text font-semibold text-[14px]"
      >
        {buttonText}
      </Button>
    </Section>
  );
};
