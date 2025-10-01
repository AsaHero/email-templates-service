import { Section, Img } from '@react-email/components';

import { ENV } from '../../config/env';

export const Header = () => {
  return (
    <Section className="mb-6">
      <Img
        className="mx-auto"
        src={`${ENV.baseUrl}/anora-logo.webp`}
        width={91}
        height={22}
        alt="лого anora"
      />
    </Section>
  );
};
