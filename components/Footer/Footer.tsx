import { Section, Text, Link } from '@react-email/components';

type TFooterProps = {
  unsubscribeUrl?: string;
};

export const Footer = ({ unsubscribeUrl = 'https://anora.app/app/profile/notifications' }: TFooterProps) => {
  return (
    <Section className="text-center">
      <Text className="text-[12px] leading-[18px] my-4">
        Вы можете в любой момент{' '}
        <Link className="text-[12px] text-text underline" href={unsubscribeUrl}>
          отписаться от рассылки
        </Link>
      </Text>
    </Section>
  );
};
