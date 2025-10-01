import { PropsWithChildren } from 'react';
import { Html, Head, Font, Body, Tailwind, Preview, Container } from '@react-email/components';

import { config } from '../twconfig';

type TBaseLayoutProps = PropsWithChildren<{
  title: string;
  preview: string;
}>;

const fontsUrl = process.env.NEXT_PUBLIC_CDN_HOST
  ? `${process.env.NEXT_PUBLIC_CDN_HOST}/public/static/fonts`
  : '/static/fonts';

export const BaseLayout = ({ title, preview, children }: TBaseLayoutProps) => {
  return (
    <Html lang="ru">
      <Head>
        <title>{title}</title>

        <Font
          fontFamily="Rawline"
          fallbackFontFamily="Arial"
          webFont={{
            url: `${fontsUrl}/rawline-400.woff2`,
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />

        <Font
          fontFamily="Rawline"
          fallbackFontFamily="Arial"
          webFont={{
            url: `${fontsUrl}/rawline-600.woff2`,
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body>
        <Tailwind config={config}>
          <Body className="mx-auto my-auto p-0 bg-white text-text">
            <Container className="mx-auto max-w-[600px] my-8 p-8 bg-bg rounded-[16px]">{children}</Container>
          </Body>
        </Tailwind>
      </Body>
    </Html>
  );
};
