import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { ApplicationService } from '@/src/services/applicationService';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';
import { strictRateLimit } from '@/src/middleware/ratelimitMIddleware';

// ✅ POST /api/v1/applications - PUBLIC (No auth required)
export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting to prevent spam
    const rateLimitResult = await strictRateLimit(req);
    if (rateLimitResult) return rateLimitResult;
    
    const body = await req.json();
    console.log("📝 Received application:", JSON.stringify(body, null, 2));
    
    // ✅ Validate jobId is a valid MongoDB ObjectId
    if (!body.jobId || !mongoose.Types.ObjectId.isValid(body.jobId)) {
      return ApiResponse.error('Invalid job ID. Please apply from the jobs page.', 400);
    }
    
    // Validate required fields
    const required = [
      'firstName', 'lastName', 'email', 'phone',
      'country', 'position', 'coverLetter'
    ];
    
    for (const field of required) {
      if (!body[field]) {
        console.log(`❌ Missing field: ${field}`);
        return ApiResponse.error(`${field} is required`, 400);
      }
    }
    
    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(body.email)) {
      return ApiResponse.error('Please provide a valid email address', 400);
    }
    
    // Validate experience only for non-freshers
    if (!body.isFresher) {
      if (!body.experience && body.experience !== 0) {
        return ApiResponse.error('Years of experience is required for experienced candidates', 400);
      }
      if (body.experience && parseInt(body.experience) < 0) {
        return ApiResponse.error('Experience cannot be negative', 400);
      }
    }
    
    console.log("✅ Validation passed, calling ApplicationService.submit");
    
    const application = await ApplicationService.submit(body);
    
    console.log("✅ Application created:", application._id);
    
    return ApiResponse.success(application, 'Application submitted successfully', 201);
    
  } catch (error: any) {
    console.error('❌ Submit application error:', error);
    
    if (error.message === 'You have already applied for this position') {
      return ApiResponse.error(error.message, 400);
    }
    if (error.message === 'Job not found or no longer accepting applications') {
      return ApiResponse.error(error.message, 404);
    }
    
    return ApiResponse.error(error.message || 'Failed to submit application', 500);
  }
}

// ✅ GET /api/v1/applications - ADMIN ONLY (requires auth)
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || undefined;
    const jobId = searchParams.get('jobId') || undefined;
    const search = searchParams.get('search') || undefined;
    
    const result = await ApplicationService.findAll({
      page,
      limit,
      status,
      jobId,
      search,
    });
    
    return ApiResponse.success(result.data, 'Applications retrieved', 200, result.pagination);
    
  } catch (error) {
    console.error('Get applications error:', error);
    return ApiResponse.error('Failed to fetch applications', 500);
  }
}