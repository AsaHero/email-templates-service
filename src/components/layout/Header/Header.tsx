import { Section, Img } from "@react-email/components";

import { emailConfig } from "../../../config/email.config";

export const Header = () => {
  return (
    <Section className="mb-6">
      <Img
        className="mx-auto"
        src={`${emailConfig.assets.baseUrl}/anora-logo.png`}
        width={91}
        height={22}
        alt="лого anora"
      />
    </Section>
  );
};
