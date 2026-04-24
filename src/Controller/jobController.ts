import { NextRequest } from 'next/server';
import { JobService } from '@/src/services/jobService';
import { ApiResponse } from '@/src/utils/apiResponse';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { Types } from 'mongoose';

export class JobController {
  static async list(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    
    const jobs = await JobService.findAll({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      location: searchParams.get('location') || undefined,
      type: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
    });

    return ApiResponse.success(jobs.data, 'Jobs retrieved', 200, jobs.pagination);
  }

  static async getById(req: NextRequest, params: { id: string }) {
    const job = await JobService.findById(params.id);
    
    if (!job) {
      return ApiResponse.error('Job not found', 404);
    }
    
    return ApiResponse.success(job, 'Job retrieved');
  }

  static async create(req: NextRequest) {
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }

    const body = await req.json();
    
    // Validation
    const required = ['title', 'company', 'location', 'country', 'type', 'description'];
    for (const field of required) {
      if (!body[field]) {
        return ApiResponse.error(`${field} is required`, 400);
      }
    }

    const job = await JobService.create(body, user.id);
    return ApiResponse.success(job, 'Job created successfully', 201);
  }

  static async update(req: NextRequest, params: { id: string }) {
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }

    const body = await req.json();
    const job = await JobService.update(params.id, body);
    
    if (!job) {
      return ApiResponse.error('Job not found', 404);
    }
    
    return ApiResponse.success(job, 'Job updated successfully');
  }

  static async delete(req: NextRequest, params: { id: string }) {
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }

    const deleted = await JobService.delete(params.id);
    
    if (!deleted) {
      return ApiResponse.error('Job not found', 404);
    }
    
    return ApiResponse.success(null, 'Job deleted successfully');
  }
}