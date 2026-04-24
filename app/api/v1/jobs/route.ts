import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Job from '@/src/models/job/jobModel';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'active';
    
    const query: any = { status, isDeleted: false };
    
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
    
  } catch (error: any) {
    console.error('GET /jobs error:', error);
    return ApiResponse.error(error.message || 'Failed to fetch jobs', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }
    
    const body = await req.json();
    
    // Log what we're receiving
    console.log('Creating job with data:', body);
    
    // Validate required fields
    const requiredFields = ['title', 'company', 'location', 'country', 'type', 'description'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return ApiResponse.error(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }
    
    const job = await Job.create({
      title: body.title,
      company: body.company,
      location: body.location,
      country: body.country || 'Nepal',
      type: body.type,
      salary: body.salary || '',
      description: body.description,
      requirements: body.requirements || [],
      benefits: body.benefits || [],
      category: body.category || '',
      experience: body.experience || '',
      vacancies: body.vacancies || 1,
      status: body.status || 'active',
      isFeatured: body.isFeatured || false,
      postedBy: user.id,
    });
    
    return ApiResponse.success(job, 'Job created successfully', 201);
    
  } catch (error: any) {
    console.error('POST /jobs error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message).join(', ');
      return ApiResponse.error(messages, 400);
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return ApiResponse.error('A job with this title already exists', 400);
    }
    
    return ApiResponse.error(error.message || 'Failed to create job', 500);
  }
}