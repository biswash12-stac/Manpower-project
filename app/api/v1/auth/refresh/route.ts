import { NextRequest } from 'next/server';
import { verifyRefreshToken, generateAccessToken, TokenPayload } from '@/src/utils/jasonwebtoken';
import { ApiResponse } from '@/src/utils/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    
    if (!refreshToken) {
      return ApiResponse.error('Refresh token required', 400);
    }
    
    // Verify refresh token
    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      return ApiResponse.error('Invalid or expired refresh token', 401);
    }
    
    // Generate new access token
    const newAccessToken = generateAccessToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });
    
    return ApiResponse.success({
      accessToken: newAccessToken,
    }, 'Token refreshed successfully');
    
  } catch (error) {
    console.error('Refresh token error:', error);
    return ApiResponse.error('Internal server error', 500);
  }
}