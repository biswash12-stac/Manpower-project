import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { ContactReply } from '@/emails/contactReply';

const resend = new Resend(process.env.RESEND_EMAIL_APIKEY);

export async function POST(req: NextRequest) {
  try {
    const { to, name, replyMessage } = await req.json();

    if (!to || !name || !replyMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      replyTo: process.env.ADMIN_EMAIL,
      subject: `Response to Your Inquiry - Gulf Empire`,
      react: ContactReply({ name, replyMessage }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: data?.id });
    
  } catch (error) {
    console.error('Send reply error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}