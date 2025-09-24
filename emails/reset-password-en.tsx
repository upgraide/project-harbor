import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailEnProps {
  toName?: string;
  resetPasswordLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const ResetPasswordEmailEn = ({
  toName,
  resetPasswordLink,
}: ResetPasswordEmailEnProps) => {
  const previewText = `Reset Password - Harbor Exclusive Investment Opportunities`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/harbor-logo.png`}
                width="200"
                height="50"
                alt="Harbor Partners"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              <strong>Harbor Exclusive Investment Opportunities</strong>
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hi, {toName},
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              Someone recently requested a password change for your Harbor
              Exclusive Investment Opportunities account. If this was you, you
              can set a new password here:
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline w-[90%]"
                href={resetPasswordLink}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              <strong>Equipa Harbor Partners</strong>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordEmailEn.PreviewProps = {
  toName: "alanturing",
  resetPasswordLink: "https://localhost:3000",
} as ResetPasswordEmailEnProps;

export default ResetPasswordEmailEn;
