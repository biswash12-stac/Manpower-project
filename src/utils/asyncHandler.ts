import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from './apiResponse';

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse>;

export function asyncHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('Unhandled error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message === 'UNAUTHORIZED') {
          return ApiResponse.error('Unauthorized', 401);
        }
        if (error.message.includes('duplicate')) {
          return ApiResponse.error('Duplicate entry detected', 409);
        }
      }
      
      return ApiResponse.error('Internal server error', 500);
    }
  };
}