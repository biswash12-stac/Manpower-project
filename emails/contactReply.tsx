import * as React from 'react';
import { Html, Body, Container, Heading, Text, Hr, Tailwind, Section } from '@react-email/components';

interface ContactReplyProps {
  name: string;
  replyMessage: string;
}

export function ContactReply({ name, replyMessage }: ContactReplyProps) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-gray-50 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-gray-200 rounded my-10 mx-auto p-5 max-w-[465px] bg-white">
            <Heading className="text-black text-2xl font-normal text-center p-0 my-8 mx-0">
              Gulf Empire - Response to Your Inquiry
            </Heading>
            
            <Text className="text-black text-sm leading-6">Dear {name},</Text>
            
            <Text className="text-black text-sm leading-6">
              Thank you for reaching out to Gulf Empire. Here's our response:
            </Text>
            
            <Section className="bg-gray-50 p-4 rounded my-4">
              <Text className="text-black text-sm leading-6">{replyMessage}</Text>
            </Section>
            
            <Text className="text-black text-sm leading-6">
              If you have any further questions, please don't hesitate to contact us.
            </Text>
            
            <Hr className="border border-solid border-gray-200 my-6 mx-0 w-full" />
            
            <Text className="text-gray-500 text-xs leading-6">
              Best regards,<br />
              Gulf Empire Team<br />
              <span className="text-xs">www.gulfempire.com</span>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}