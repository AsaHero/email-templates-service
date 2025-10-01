import 'dotenv/config';
import { Container, Section, Row, Column } from '@react-email/components';

import { BaseLayout } from '../layouts/base-layout';

import { Header } from '../components/Header';
import { ContentBlock, TContentBlockProps } from '../components/ContentBlock';
import { Footer } from '../components/Footer';

import { ENV } from '../config/env';

type TAnoraSingleProps = {
  title: string;
  preview: string;
  blocks: TContentBlockProps[];
  single: TContentBlockProps;
};

export const AnoraThreeColumns = ({ title, preview, blocks, single }: TAnoraSingleProps) => {
  const firstBlock = blocks[0];
  const secondBlock = blocks[1];

  return (
    <BaseLayout title={title} preview={preview}>
      <Header />

      <Container>
        <Section>
          <Row>
            <Column className="w-[50%] pr-2 rounded-lg">
              <ContentBlock
                title={firstBlock.title}
                text={firstBlock.text}
                imageUrl={firstBlock.imageUrl}
                imageAlt={firstBlock.imageAlt}
                imageWidth={firstBlock.imageWidth}
                imageHeight={firstBlock.imageHeight}
                buttonText={firstBlock.buttonText}
                buttonUrl={firstBlock.buttonUrl}
                wrapperClassName="p-4"
              />
            </Column>
            <Column className="w-[50%] pl-2 rounded-lg">
              <ContentBlock
                title={secondBlock.title}
                text={secondBlock.text}
                imageUrl={secondBlock.imageUrl}
                imageAlt={secondBlock.imageAlt}
                imageWidth={secondBlock.imageWidth}
                imageHeight={secondBlock.imageHeight}
                buttonText={secondBlock.buttonText}
                buttonUrl={secondBlock.buttonUrl}
                wrapperClassName="p-4"
              />
            </Column>
          </Row>
        </Section>

        <ContentBlock
          title={single.title}
          text={single.text}
          imageUrl={single.imageUrl}
          imageAlt={single.imageAlt}
          imageWidth={single.imageWidth}
          imageHeight={single.imageHeight}
          buttonText={single.buttonText}
          buttonUrl={single.buttonUrl}
          wrapperClassName="mt-4"
        />
      </Container>

      <Footer />
    </BaseLayout>
  );
};

AnoraThreeColumns.PreviewProps = {
  title: 'Новое переживание в ленте',
  preview: 'Переживание наполнено',
  blocks: [
    {
      title: 'У тебя новые отклики',
      text: 'Твои слова не остались без ответа — у тебя {N} новых откликов. Посмотри чем тебе откликнулись!',
      imageUrl: `${ENV.baseUrl}/masks.webp`,
      imageAlt: 'маски',
      imageWidth: 76,
      imageHeight: 76,
      buttonText: 'Смотреть отклики',
      buttonUrl: 'https://anora.app',
    },
    {
      title: (
        <>
          Тебя
          <br />
          поддержали
        </>
      ),
      text: (
        <>
          Отправили тебе частицу свой поддержки и тепла,
          <br />
          наполнив твое на 12 лун
        </>
      ),
      imageUrl: `${ENV.baseUrl}/loonas.webp`,
      imageAlt: 'луны',
      imageWidth: 76,
      imageHeight: 76,
      buttonText: 'Смотреть поддержку',
      buttonUrl: 'https://anora.app',
    },
  ],
  single: {
    title: 'Нужна твоя поддержка',
    text: 'Сегодня в ленте появилось {N} переживаний.Загляни и поддержи тех, кому важно услышать отклик.',
    imageUrl: `${ENV.baseUrl}/happy-smile.webp`,
    imageAlt: 'смайл',
    imageWidth: 76,
    imageHeight: 76,
    buttonText: 'Смотреть ленту',
    buttonUrl: 'https://anora.app',
  },
};

export default AnoraThreeColumns;
