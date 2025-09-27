import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';
import * as React from 'react';

interface NotificationEmailProps {
  organizationName: string;
  items: {
    make: string;
    model: string;
    registrationNumber: string;
    notificationType: 'Insurance' | 'Technical Inspection';
    dueDate: Date;
    daysUntil: 7 | 14;
  }[];
}

const getPolishNotificationType = (notificationType: 'Insurance' | 'Technical Inspection') => {
  switch (notificationType) {
    case 'Insurance':
      return 'Ubezpieczenie';
    case 'Technical Inspection':
      return 'Przegląd techniczny';
  }
};

export const NotificationEmail = ({ organizationName, items }: NotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Nadchodzące terminy wygaśnięcia dla Twoich pojazdów</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Witaj {organizationName},</Heading>
        <Text style={text}>Oto nadchodzące terminy wygaśnięcia dla Twoich pojazdów:</Text>
        <Section style={box}>
          {items.map((item, index) => (
            <div key={index}>
              <Text style={text}>
                <strong>
                  {item.make} {item.model}
                </strong>{' '}
                ({item.registrationNumber}) - {getPolishNotificationType(item.notificationType)} wygasa za {item.daysUntil} dni, dnia{' '}
                {item.dueDate.toLocaleDateString('pl-PL')}.
              </Text>
            </div>
          ))}
        </Section>
        <Text style={text}>Prosimy o podjęcie niezbędnych działań.</Text>
      </Container>
    </Body>
  </Html>
);

export default NotificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const box = {
  padding: '0 48px',
};
