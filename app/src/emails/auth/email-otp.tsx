import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type Props = {
  toName: string;
  OTP: string;
};

const EmailOTP = ({ toName, OTP }: Props) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body>
          <Container>
            <Section>
              <Text>
                Olá {toName}, seu código de verificação é: {OTP}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailOTP.PreviewProps = {
  toName: "John Doe",
  OTP: "123456",
};

export default EmailOTP;
