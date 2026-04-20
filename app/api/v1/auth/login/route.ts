import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Admin from '@/models/admin';
import { generateAccessToken, generateRefreshToken } from '@/src/utils/jwt';
import { ApiResponse } from '@/src/utils/apiResponse';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return ApiResponse.error('Email and password are required', 400);
    }
    
    // Find admin
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      return ApiResponse.error('Invalid credentials', 401);
    }
    
    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return ApiResponse.error('Invalid credentials', 401);
    }
    
    // Check if admin is active
    if (!admin.isActive) {
      return ApiResponse.error('Account is deactivated. Contact super admin.', 403);
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Generate tokens
    const payload = {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    };
    
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    // ✅ Return format that matches frontend expectation
    return ApiResponse.success({
      user: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    }, 'Login successful');
    
  } catch (error) {
    console.error('Login error:', error);
    return ApiResponse.error('Internal server error', 500);
  }
}