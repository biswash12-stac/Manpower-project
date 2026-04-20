import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Admin from '@/src/models/admin/adminModle';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized - Please login', 401);
    }
    
    const admin = await Admin.findById(user.id).select('-password');
    if (!admin) {
      return ApiResponse.error('Admin not found', 404);
    }
    
    return ApiResponse.success({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
    }, 'Profile retrieved');
    
  } catch (error) {
    console.error('Me API error:', error);
    return ApiResponse.error('Internal server error', 500);
  }
}