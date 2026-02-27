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

type OpportunityActiveEmailProps = {
  investorName: string;
  opportunityName: string;
  opportunityType: "MA" | "REAL_ESTATE";
  coverImageUrl?: string;
  dealPageUrl: string;
  language: "en" | "pt";
  logoUrl?: string;
};

const translations = {
  en: {
    previewText: (name: string) =>
      `New investment opportunity available: ${name}`,
    greeting: (name: string) => `Dear ${name},`,
    intro:
      "A new exclusive investment opportunity is now available on Harbor Partners:",
    typeLabel: { MA: "M&A", REAL_ESTATE: "Real Estate" },
    cta: "View Opportunity",
    support: "Our team is available to provide all necessary support.",
    signoff: "Harbor Partners Team",
  },
  pt: {
    previewText: (name: string) =>
      `Nova oportunidade de investimento disponível: ${name}`,
    greeting: (name: string) => `Caro(a) ${name},`,
    intro:
      "Uma nova oportunidade de investimento exclusiva está agora disponível na Harbor Partners:",
    typeLabel: { MA: "M&A", REAL_ESTATE: "Imobiliário" },
    cta: "Ver Oportunidade",
    support:
      "A nossa equipa encontra-se à disposição para prestar todo o apoio necessário.",
    signoff: "Equipa Harbor Partners",
  },
};

export const OpportunityActiveEmail = ({
  investorName,
  opportunityName,
  opportunityType,
  coverImageUrl,
  dealPageUrl,
  language = "pt",
  logoUrl = "https://www.harborpartners.app/assets/logo-dark.png",
}: OpportunityActiveEmailProps) => {
  const t = translations[language];

  return (
    <Html>
      <Head />
      <Preview>{t.previewText(opportunityName)}</Preview>
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
              {t.greeting(investorName)}
            </Text>
            <Text className="text-[#113152] text-[14px] leading-[24px]">
              {t.intro}
            </Text>
            <Section className="mt-[32px] mb-[32px] rounded-md border border-dashed bg-[#F5F5F5] p-4 text-center">
              {coverImageUrl && (
                <Img
                  alt={opportunityName}
                  className="mx-auto mb-3 rounded"
                  src={coverImageUrl}
                  width="400"
                />
              )}
              <Text className="text-left text-[#113152] text-[18px] leading-[24px]">
                <strong>{opportunityName}</strong>
              </Text>
              <Text className="text-left text-[#113152] text-[12px] leading-[20px]">
                {t.typeLabel[opportunityType]}
              </Text>
            </Section>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="mt-0 w-[90%] rounded bg-[#113152] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={dealPageUrl}
              >
                {t.cta}
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

OpportunityActiveEmail.PreviewProps = {
  investorName: "John Doe",
  opportunityName: "Acme Corp Acquisition",
  opportunityType: "MA",
  coverImageUrl: undefined,
  dealPageUrl: "https://www.harborpartners.app/dashboard/ma/some-id",
  language: "pt",
  logoUrl: "https://www.harborpartners.app/assets/logo-dark.png",
} as OpportunityActiveEmailProps;
