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

interface VercelInviteUserEmailProps {
  toName?: string;
  toEmail?: string;
  toPassword?: string;
  inviteLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const VercelInviteUserEmail = ({
  toName,
  toEmail,
  toPassword,
  inviteLink,
}: VercelInviteUserEmailProps) => {
  const previewText = `Convite Exclusivo - Acesso à Harbor Exclusive Investment Opportunities`;
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
              Caro(a) {toName},
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              A Harbor Partners tem o prazer de apresentar a sua nova plataforma
              digital Harbor Exclusive Investment Opportunities.
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              Nesta plataforma, encontrará apenas oportunidades de investimento
              cuidadosamente selecionadas e adaptadas ao seu perfil específico,
              garantindo que tem acesso exclusivo a projetos alinhados com os
              seus interesses e requisitos.
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              Toda a informação está centralizada e organizada de forma clara,
              com uma interface segura e intuitiva que permite aos investidores
              aceder rapidamente a todos os dados relevantes.
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              Para aceder à plataforma, basta clicar neste butão e inserir os
              seguintes dados:
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center border border-dashed bg-gray-100 rounded-md p-4">
              <Text className="text-[14px] text-black text-left">
                <strong>Email:</strong> {toEmail}
              </Text>
              <Text className="text-[14px] text-black text-left">
                <strong>Password:</strong> {toPassword}
              </Text>
            </Section>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline w-[90%]"
                href={inviteLink}
              >
                Aceder à plataforma
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              A nossa equipa encontra-se à disposição para prestar todo o apoio
              necessário.
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

VercelInviteUserEmail.PreviewProps = {
  toName: "alanturing",
  toEmail: "alanturing@example.com",
  toPassword: "123456",
  inviteLink: "https://localhost:3000",
} as VercelInviteUserEmailProps;

export default VercelInviteUserEmail;
