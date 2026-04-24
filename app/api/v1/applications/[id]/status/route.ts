import { NextRequest } from 'next/server';
import { ApplicationService } from '@/src/services/applicationSevice';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';
import mongoose from 'mongoose';

// PATCH /api/v1/applications/[id]/status - Admin only
export async function PATCH(
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
    
    const { status, notes } = await req.json();
    
    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return ApiResponse.error('Invalid status', 400);
    }
    
    const application = await ApplicationService.updateStatus(id, status, user.id, notes);
    
    if (!application) {
      return ApiResponse.error('Application not found', 404);
    }
    
    return ApiResponse.success(application, `Application ${status} successfully`);
    
  } catch (error) {
    console.error('Update application status error:', error);
    return ApiResponse.error('Failed to update application status', 500);
  }
}