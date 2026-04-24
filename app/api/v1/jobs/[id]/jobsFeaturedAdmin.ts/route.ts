import { NextRequest } from 'next/server';
import { JobService } from '@/src/services/jobService';
import { ApiResponse } from '@/src/utils/apiResponse';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { asyncHandler } from '@/src/utils/asyncHandler';

// POST /api/v1/jobs/:id/feature - Make job featured (Admin only)
export const POST = asyncHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const user = getAuthUser(req);
  if (!user) {
    return ApiResponse.error('Unauthorized', 401);
  }

  const { durationDays = 30 } = await req.json();
  const job = await JobService.featureJob(params.id, durationDays);
  
  if (!job) {
    return ApiResponse.error('Job not found', 404);
  }
  
  return ApiResponse.success(job, 'Job featured successfully');
});

// DELETE /api/v1/jobs/:id/feature - Remove featured status (Admin only)
export const DELETE = asyncHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const user = getAuthUser(req);
  if (!user) {
    return ApiResponse.error('Unauthorized', 401);
  }

  const job = await JobService.unfeatureJob(params.id);
  
  if (!job) {
    return ApiResponse.error('Job not found', 404);
  }
  
  return ApiResponse.success(job, 'Featured status removed');
});