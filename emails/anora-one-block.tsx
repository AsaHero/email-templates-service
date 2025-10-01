import 'dotenv/config';

import { BaseLayout } from '../layouts/base-layout';

import { Header } from '../components/Header';
import { ContentBlock, TContentBlockProps } from '../components/ContentBlock';
import { Footer } from '../components/Footer';

import { ENV } from '../config/env';

type TAnoraSingleProps = {
  title: string;
  preview: string;
  content: TContentBlockProps;
};

export const AnoraSingle = ({ title, preview, content }: TAnoraSingleProps) => {
  return (
    <BaseLayout title={title} preview={preview}>
      <Header />
      <ContentBlock
        title={content.title}
        text={content.text}
        imageUrl={content.imageUrl}
        imageAlt={content.imageAlt}
        imageWidth={content.imageWidth}
        imageHeight={content.imageHeight}
        buttonText={content.buttonText}
        buttonUrl={content.buttonUrl}
      />
      <Footer />
    </BaseLayout>
  );
};

AnoraSingle.PreviewProps = {
  title: 'Новое переживание в ленте',
  preview: 'Переживание наполнено',
  content: {
    title: 'Переживание наполнено!',
    text: 'Участники полностью наполнили твое переживание поддержкой. Сообщество откликнулось и показало, что ты не один в своих чувствах.',
    imageUrl: `${ENV.baseUrl}/star.webp`,
    imageAlt: 'лого звезды',
    imageWidth: 56,
    imageHeight: 56,
    buttonText: 'Смотреть переживание',
    buttonUrl: 'https://anora.app',
  },
};

export default AnoraSingle;
