import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type Props = {
  toName: string;
  inviteUrl: string;
};

const InviteNewUser = ({ toName, inviteUrl }: Props) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans m-12">
          <Container>
            <Section>
              <Text>
                Caro(a) {toName}, <br />
                <br />A <span className="font-bold">Harbor Partners</span> tem o
                prazer de apresentar a sua nova plataforma digital{" "}
                <span className="font-bold">
                  Harbor Exclusive Investment Opportunities
                </span>
                . <br />
                <br />
                Aqui poderá encontrar e explorar as{" "}
                <span className="font-bold">
                  oportunidades de investimento mais exclusivas em Portugal
                </span>
                , numa solução desenvolvida para{" "}
                <span className="font-bold">
                  melhorar a experiência dos nossos investidores
                </span>
                , reforçar a <span className="font-bold">transparência</span> e
                centralizar toda a informação.
                <br />
                <br /> Com uma interface intuitiva e segura, terá acesso rápido
                a todos os dados relevantes, organizados de forma clara e
                acessível.
                <br />
                <br /> Para aceder à plataforma, basta clicar neste botão e
                seguir os passos indicados.
              </Text>
            </Section>
            <Section className="text-center">
              <Button
                href={inviteUrl}
                style={{
                  backgroundColor: "#11112D",
                  color: "#ffffff",
                  padding: "12px 20px",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  display: "inline-block",
                }}
              >
                Aceitar Convite
              </Button>
            </Section>
            <Section>
              <Text>
                A nossa equipa encontra-se à disposição para prestar todo o
                apoio necessário.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InviteNewUser.PreviewProps = {
  toName: "John Doe",
  inviteUrl: "https://example.com/invite/123",
};

export default InviteNewUser;
