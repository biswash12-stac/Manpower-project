import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Job from '@/src/models/job/jobModel';
import { ApiResponse } from '@/src/utils/apiResponse';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    
    // Get featured jobs that are active and not expired
    const jobs = await Job.find({
      status: 'active',
      isFeatured: true,
      isDeleted: false,
      $or: [
        { featuredExpiry: { $gt: new Date() } },
        { featuredExpiry: null }
      ]
    })
    .sort({ featuredAt: -1 })
    .limit(limit)
    .select('title location type salary company') // Only what your frontend needs
    .lean();
    
    return ApiResponse.success(jobs, 'Featured jobs retrieved');
    
  } catch (error) {
    console.error('Featured jobs error:', error);
    return ApiResponse.error('Failed to fetch featured jobs', 500);
  }
}