import {
  Container,
  Section,
  Heading,
  Text,
  Img,
} from "@react-email/components";
import { BaseLayout } from "../components/layout/BaseLayout/BaseLayout";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { VerificationCodeEmailRequest } from "../types/email.types";
import { emailConfig } from "../config/email.config";

export interface VerificationCodeTemplateProps {
  data: VerificationCodeEmailRequest;
}

export const VerificationCodeTemplate = ({
  data,
}: VerificationCodeTemplateProps) => {
  const { subject, preview, code } = data;

  return (
    <BaseLayout title={subject} preview={preview}>
      <Header />

      <Container className="mx-auto my-0 max-w-[600px] rounded-2xl bg-[#170a2a] p-8 text-center">
        <Section>
          <Img
            className="mx-auto mb-4"
            src={`${emailConfig.assets.baseUrl}/pincode-lock.png`}
            width={76}
            height={76}
            alt="Замок"
          />

          <Heading className="m-0 mb-2 text-[24px] font-semibold leading-[30px] text-white">
            Твой код для входа
          </Heading>

          <Text className="m-0 mb-6 text-[14px] leading-[20px] text-white/70">
            Чтобы войти в Anora, введите код подтверждения
          </Text>

          <Section className="my-4">
            <span className="inline-block rounded-full bg-[#4b1a8f] px-7 py-3">
              <Text className="m-0 text-[22px] font-bold leading-none tracking-[0.04em] text-white">
                {code}
              </Text>
            </span>
          </Section>
        </Section>
      </Container>
    </BaseLayout>
  );
};
