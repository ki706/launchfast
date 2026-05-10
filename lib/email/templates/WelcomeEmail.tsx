import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userFirstname?: string;
}

export const WelcomeEmail = ({
  userFirstname = 'there',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to the AI Era with LaunchFast.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Text style={logo}>LaunchFast</Text>
        </Section>
        <Heading style={h1}>Welcome to the AI Era.</Heading>
        <Text style={text}>Hi {userFirstname},</Text>
        <Text style={text}>
          Thank you for choosing LaunchFast. You&apos;re now part of a community of developers
          building the next generation of AI-powered applications.
        </Text>
        <Section style={btnContainer}>
          <Link style={button} href="https://launchfast.io/dashboard">
            Get Started
          </Link>
        </Section>
        <Text style={text}>
          Best,
          <br />
          The LaunchFast Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          LaunchFast Inc • 123 Tech Lane, San Francisco, CA 94105
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#050505',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const logoContainer = {
  padding: '32px',
};

const logo = {
  color: '#F0EDE6',
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '-0.5px',
};

const h1 = {
  color: '#F0EDE6',
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#888880',
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#ffffff',
  borderRadius: '5px',
  color: '#000000',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  marginTop: '20px',
  marginBottom: '20px',
};

const hr = {
  borderColor: '#1A1A1A',
  margin: '20px 0',
};

const footer = {
  color: '#555555',
  fontSize: '12px',
};
