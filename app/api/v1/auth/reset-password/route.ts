import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Admin from '@/src/models/admin/adminModle';
import { ApiResponse } from '@/src/utils/apiResponse';
import bcrypt from 'bcryptjs';

// Same reset tokens store (in production, use Redis)
const resetTokens = new Map<string, { token: string; expiry: Date }>();

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { token, password } = await req.json();
    
    if (!token || !password) {
      return ApiResponse.error('Token and password are required', 400);
    }
    
    if (password.length < 6) {
      return ApiResponse.error('Password must be at least 6 characters', 400);
    }
    
    // Find the admin by token
    let adminId = null;
    let storedToken = null;
    
    for (const [id, data] of resetTokens.entries()) {
      if (data.token === token && data.expiry > new Date()) {
        adminId = id;
        storedToken = data;
        break;
      }
    }
    
    if (!adminId) {
      return ApiResponse.error('Invalid or expired reset token', 400);
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update admin password
    await Admin.findByIdAndUpdate(adminId, { password: hashedPassword });
    
    // Remove used token
    resetTokens.delete(adminId);
    
    return ApiResponse.success(null, 'Password reset successfully');
    
  } catch (error) {
    console.error('Reset password error:', error);
    return ApiResponse.error('Failed to reset password', 500);
  }
}