import nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
    try {
        const mailOptions: SendMailOptions = {
            from: `"Gulf Empire Recruitment" <${process.env.EMAIL_USER}>`,
            to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${options.to}`);
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send email');
    }
}

// Email templates
export const emailTemplates = {
    // Application confirmation for candidate
    applicationConfirmation: (name: string, jobTitle: string): string => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">Thank You for Applying!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for submitting your application for the position of <strong>${jobTitle}</strong> at Gulf Empire.</p>
      <p>We have received your application and our recruitment team will review it carefully.</p>
      <p>If your profile matches our requirements, we will contact you within 5-7 business days.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>Gulf Empire Recruitment Team</strong></p>
      <hr/>
      <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
    </div>
  `,

    // Admin notification for new application
    adminNewApplication: (name: string, jobTitle: string, email: string): string => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">New Job Application Received</h2>
      <p><strong>Candidate:</strong> ${name}</p>
      <p><strong>Position:</strong> ${jobTitle}</p>
      <p><strong>Email:</strong> ${email}</p>
      <br/>
      <p>Login to the admin panel to review this application.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/applications" 
         style="background-color: #0A2463; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        View Application
      </a>
    </div>
  `,

    // Contact form confirmation
    contactConfirmation: (name: string): string => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">We've Received Your Message</h2>
      <p>Dear ${name},</p>
      <p>Thank you for contacting Gulf Empire. We have received your inquiry and our team will get back to you within 24-48 hours.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>Gulf Empire Support Team</strong></p>
    </div>
  `,

    // Admin notification for new contact
    adminNewContact: (name: string, subject: string, message: string): string => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <br/>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/contacts" 
         style="background-color: #0A2463; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        View Message
      </a>
    </div>
  `,

    // Application status update
    statusUpdate: (name: string, jobTitle: string, status: string, notes?: string): string => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">Application Status Update</h2>
      <p>Dear ${name},</p>
      <p>Your application for <strong>${jobTitle}</strong> has been <strong style="color: #D4AF37;">${status}</strong>.</p>
      ${notes ? `<p><strong>Notes from recruiter:</strong> ${notes}</p>` : ''}
      <br/>
      <p>Thank you for your interest in Gulf Empire.</p>
      <p>Best regards,</p>
      <p><strong>Gulf Empire Recruitment Team</strong></p>
    </div>
  `,

    // Job posting notification (for subscribers - future feature)
    newJobAlert: (email: string, jobTitle: string, location: string): string => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">New Job Opportunity!</h2>
      <p>A new position has been posted that matches your profile:</p>
      <p><strong>${jobTitle}</strong> in ${location}</p>
      <br/>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs" 
         style="background-color: #0A2463; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        View Job
      </a>
    </div>
  `,
};