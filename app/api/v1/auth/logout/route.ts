import { NextRequest } from 'next/server';
import { ApiResponse } from '@/src/utils/apiResponse';

export async function POST(req: NextRequest) {
  try {
    // In a production app with Redis, you would:
    // 1. Get the token from Authorization header
    // 2. Add it to a blacklist in Redis with expiry = token expiry
    // 3. This prevents the token from being used again
    
    // For now, the client just needs to delete the token from localStorage
    // The server simply acknowledges the logout request
    
    return ApiResponse.success(null, 'Logged out successfully');
    
  } catch (error) {
    console.error('Logout error:', error);
    return ApiResponse.error('Logout failed', 500);
  }
}