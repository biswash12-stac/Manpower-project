import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Job from '@/src/models/job/jobModel';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';

// GET /api/v1/jobs - Public (list all active jobs)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'active';
    
    const query: any = { status, isDeleted: false };
    
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Job.countDocuments(query);
    
    return ApiResponse.success({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, 'Jobs retrieved');
    
  } catch (error) {
    console.error('GET /jobs error:', error);
    return ApiResponse.error('Failed to fetch jobs', 500);
  }
}

// POST /api/v1/jobs - Admin only
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }
    
    const body = await req.json();
    
    // Validate required fields
    const required = ['title', 'company', 'location', 'country', 'type', 'description'];
    for (const field of required) {
      if (!body[field]) {
        return ApiResponse.error(`${field} is required`, 400);
      }
    }
    
    const job = await Job.create({
      title: body.title,
      company: body.company,
      location: body.location,
      country: body.country,
      type: body.type,
      salary: body.salary || '',
      description: body.description,
      requirements: body.requirements || [],
      benefits: body.benefits || [],
      status: body.status || 'active',
      postedBy: user.id,
    });
    
    return ApiResponse.success(job, 'Job created successfully', 201);
    
  } catch (error) {
    console.error('POST /jobs error:', error);
    return ApiResponse.error('Failed to create job', 500);
  }
}