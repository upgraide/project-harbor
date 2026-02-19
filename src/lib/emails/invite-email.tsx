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

type InviteEmailProps = {
  userEmail: string;
  password: string;
  language: "en" | "pt";
  inviteLink?: string;
  logoUrl?: string;
};

const translations = {
  en: {
    previewText: "Exclusive Invite - Access to Harbor Investment Opportunities",
    greeting: "Dear Valued Investor,",
    introduction:
      "Harbor Partners is pleased to present our new digital platform - Harbor Exclusive Investment Opportunities.",
    description:
      "On this platform, you will find only carefully selected investment opportunities tailored to your specific profile, ensuring you have exclusive access to projects aligned with your interests and requirements.",
    centralized:
      "All information is centralized and organized clearly, with a secure and intuitive interface that allows investors to quickly access all relevant data.",
    access:
      "To access the platform, simply click the button below and enter the following credentials:",
    emailLabel: "Email",
    passwordLabel: "Password",
    buttonText: "Access Platform",
    support: "Our team is available to provide all necessary support.",
    signoff: "Harbor Partners Team",
  },
  pt: {
    previewText:
      "Convite Exclusivo - Acesso à Harbor Exclusive Investment Opportunities",
    greeting: "Caro(a) Investidor(a),",
    introduction:
      "A Harbor Partners tem o prazer de apresentar a sua nova plataforma digital Harbor Exclusive Investment Opportunities.",
    description:
      "Nesta plataforma, encontrará apenas oportunidades de investimento cuidadosamente selecionadas e adaptadas ao seu perfil específico, garantindo que tem acesso exclusivo a projetos alinhados com os seus interesses e requisitos.",
    centralized:
      "Toda a informação está centralizada e organizada de forma clara, com uma interface segura e intuitiva que permite aos investidores aceder rapidamente a todos os dados relevantes.",
    access:
      "Para aceder à plataforma, basta clicar neste botão e inserir os seguintes dados:",
    emailLabel: "Email",
    passwordLabel: "Password",
    buttonText: "Aceder à plataforma",
    support:
      "A nossa equipa encontra-se à disposição para prestar todo o apoio necessário.",
    signoff: "Equipa Harbor Partners",
  },
};

export const InviteEmail = ({
  userEmail,
  password,
  language = "en",
  inviteLink = "https://www.harborpartners.app/login",
  logoUrl = "https://www.harborpartners.app/assets/logo-dark.png",
}: InviteEmailProps) => {
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
              {t.description}
            </Text>
            <Text className="text-[#113152] text-[14px] leading-[24px]">
              {t.centralized}
            </Text>
            <Text className="text-[#113152] text-[14px] leading-[24px]">
              {t.access}
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
                href={inviteLink}
              >
                {t.buttonText}
              </Button>
            </Section>
            <Text className="text-[#113152] text-[14px] leading-[24px]">
              {t.support}
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

InviteEmail.PreviewProps = {
  userEmail: "investor@example.com",
  password: "SecureP@ss123",
  language: "en",
  inviteLink: "https://www.harborpartners.app/login",
  logoUrl: "https://www.harborpartners.app/assets/logo-dark.png",
} as InviteEmailProps;
