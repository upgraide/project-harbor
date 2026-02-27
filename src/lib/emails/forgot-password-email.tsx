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

type ForgotPasswordEmailProps = {
  userEmail: string;
  password: string;
  language: "en" | "pt";
  loginLink?: string;
  logoUrl?: string;
};

const translations = {
  en: {
    previewText: "Your temporary password - Harbor Partners",
    greeting: "Hello,",
    introduction:
      "We received a request to reset your password for your Harbor Partners account.",
    instructions:
      "A temporary password has been generated for you. Please use the credentials below to log in:",
    emailLabel: "Email",
    passwordLabel: "Password",
    buttonText: "Go to Login",
    securityWarning:
      "For your security, you will be asked to set a new password after logging in.",
    ignoreNotice:
      "If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged.",
    signoff: "Harbor Partners Team",
  },
  pt: {
    previewText: "A sua password temporária - Harbor Partners",
    greeting: "Olá,",
    introduction:
      "Recebemos um pedido para redefinir a password da sua conta Harbor Partners.",
    instructions:
      "Foi gerada uma password temporária para si. Utilize as credenciais abaixo para iniciar sessão:",
    emailLabel: "Email",
    passwordLabel: "Password",
    buttonText: "Ir para Login",
    securityWarning:
      "Para sua segurança, ser-lhe-á pedido que defina uma nova password após iniciar sessão.",
    ignoreNotice:
      "Se não solicitou a redefinição da password, pode ignorar este email com segurança. A sua password atual permanecerá inalterada.",
    signoff: "Equipa Harbor Partners",
  },
};

export const ForgotPasswordEmail = ({
  userEmail,
  password,
  language = "en",
  loginLink = "https://www.harborpartners.app/login",
  logoUrl = "https://www.harborpartners.app/assets/logo-dark.png",
}: ForgotPasswordEmailProps) => {
  const t = translations[language];

  return (
    <Html>
      <Head />
      <Preview>{t.previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Img
                alt="Harbor Partners"
                className="mx-auto my-0"
                height="50"
                src={logoUrl}
                width="200"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[#113152] text-[24px]">
              <strong>Harbor Exclusive Investment Opportunities</strong>
            </Heading>
            <Text className="text-[#113152] text-[14px] leading-[24px]">
              {t.greeting}
            </Text>
            <Text className="text-[#113152] text-[14px] leading-[24px]">
              {t.introduction}
            </Text>
            <Text className="text-[#113152] text-[14px] leading-[24px]">
              {t.instructions}
            </Text>
            <Section className="mt-[32px] mb-[32px] rounded-md border border-dashed bg-[#F5F5F5] p-4 text-center">
              <Text className="text-left text-[#113152] text-[14px] leading-[24px]">
                <strong>{t.emailLabel}:</strong> {userEmail}
              </Text>
              <Text className="text-left text-[#113152] text-[14px] leading-[24px]">
                <strong>{t.passwordLabel}:</strong> {password}
              </Text>
            </Section>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="mt-0 w-[90%] rounded bg-[#113152] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={loginLink}
              >
                {t.buttonText}
              </Button>
            </Section>
            <Text className="text-[#113152] text-[14px] leading-[24px]">
              {t.securityWarning}
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[20px]">
              {t.ignoreNotice}
            </Text>
            <Text className="text-[#113152] text-[14px] leading-[24px]">
              <strong>{t.signoff}</strong>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ForgotPasswordEmail.PreviewProps = {
  userEmail: "investor@example.com",
  password: "SecureP@ss123",
  language: "en",
  loginLink: "https://www.harborpartners.app/login",
  logoUrl: "https://www.harborpartners.app/assets/logo-dark.png",
} as ForgotPasswordEmailProps;
