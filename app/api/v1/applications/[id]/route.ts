import { NextRequest } from 'next/server';
import { ApplicationService } from '@/src/services/applicationService';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';
import mongoose from 'mongoose';

// GET /api/v1/applications/[id] - Admin only
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ApiResponse.error('Invalid application ID', 400);
    }

    const application = await ApplicationService.findById(id);

    if (!application) {
      return ApiResponse.error('Application not found', 404);
    }

    return ApiResponse.success(application, 'Application retrieved');

  } catch (error) {
    console.error('Get application error:', error);
    return ApiResponse.error('Failed to fetch application', 500);
  }
}