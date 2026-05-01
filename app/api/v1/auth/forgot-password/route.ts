import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Admin from '@/src/models/admin/adminModle';
import { ApiResponse } from '@/src/utils/apiResponse';
import crypto from 'crypto';
import { sendEmail } from '@/src/config/email';

// Store reset tokens (in production, use Redis with expiry)
// This is a simple in-memory store for development
const resetTokens = new Map<string, { token: string; expiry: Date }>();

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { email } = await req.json();
    
    if (!email) {
      return ApiResponse.error('Email is required', 400);
    }
    
    // Find admin by email
    const admin = await Admin.findOne({ email });
    
    // For security, don't reveal if email exists or not
    if (!admin) {
      return ApiResponse.success(null, 'If an account exists, a reset link will be sent');
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Token expires in 1 hour
    
    // Store token (in production, save to database)
    resetTokens.set(admin._id.toString(), {
      token: resetToken,
      expiry: tokenExpiry,
    });
    
    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
    
    // Send email
    await sendEmail({
      to: admin.email,
      subject: 'Password Reset Request - Gulf Empire',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0A2463;">Reset Your Password</h2>
          <p>Hello ${admin.name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #0A2463; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr />
          <p style="color: #666; font-size: 12px;">Gulf Empire Company</p>
        </div>
      `,
    });
    
    return ApiResponse.success(null, 'If an account exists, a reset link will be sent');
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return ApiResponse.error('Failed to process request', 500);
  }
}