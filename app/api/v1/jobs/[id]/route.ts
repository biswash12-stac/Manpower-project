import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Job from '@/src/models/job/jobModel';
import { ApiResponse } from '@/src/utils/apiResponse';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } =   params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ApiResponse.error('Invalid job ID', 400);
    }
    
    const job = await Job.findOne({ 
      _id: id, 
      status: 'active', 
      isDeleted: false 
    })
    .select('-isDeleted -__v')
    .lean();
    
    if (!job) {
      return ApiResponse.error('Job not found', 404);
    }
    
    // Increment view count
    await Job.updateOne({ _id: id }, { $inc: { views: 1 } });
    
    return ApiResponse.success(job, 'Job retrieved');
    
  } catch (error) {
    console.error('Get job error:', error);
    return ApiResponse.error('Failed to fetch job', 500);
  }
}