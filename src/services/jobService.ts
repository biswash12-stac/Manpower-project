import Job, { IJob } from '@/src/models/job/jobModel';
import { Types } from 'mongoose';

interface GetJobsParams {
  page?: number;
  limit?: number;
  location?: string;
  type?: string;
  category?: string;
  search?: string;
  status?: string;
}

export class JobService {
  // For your featured jobs endpoint
  static async getFeaturedJobs(limit: number = 6): Promise<IJob[]> {
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
      .select('title location type salary company _id')
      .lean();
    
    return jobs;
  }

  // Get all jobs with pagination and filters
  static async findAll(params: GetJobsParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, params.limit || 10);
    const skip = (page - 1) * limit;

    const query: any = { status: 'active', isDeleted: false };

    if (params.location) {
      query.location = { $regex: params.location, $options: 'i' };
    }
    if (params.type) query.type = params.type;
    if (params.category) query.category = params.category;
    if (params.search) {
      query.$or = [
        { title: { $regex: params.search, $options: 'i' } },
        { company: { $regex: params.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      Job.find(query)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title location type salary company _id isFeatured')
        .lean(),
      Job.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single job by ID
  static async findById(id: string): Promise<IJob | null> {
    const job = await Job.findOne({ 
      _id: id, 
      isDeleted: false 
    })
      .select('-isDeleted -__v')
      .lean();
    
    // Increment views asynchronously (don't await)
    if (job) {
      Job.updateOne({ _id: id }, { $inc: { views: 1 } }).exec();
    }
    
    return job;
  }

  // Create a new job (Admin only)
  static async create(data: Partial<IJob>, adminId: string): Promise<IJob> {
    const job = await Job.create({
      ...data,
      postedBy: new Types.ObjectId(adminId),
    });
    return job;
  }

  // Update a job (Admin only)
  static async update(id: string, data: Partial<IJob>): Promise<IJob | null> {
    const job = await Job.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    );
    return job;
  }

  // Soft delete a job (Admin only)
  static async delete(id: string): Promise<boolean> {
    const result = await Job.updateOne(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() }
    );
    return result.modifiedCount > 0;
  }

  // Feature a job (Admin only)
  static async featureJob(id: string, durationDays: number = 30): Promise<IJob | null> {
    const featuredExpiry = new Date();
    featuredExpiry.setDate(featuredExpiry.getDate() + durationDays);
    
    const job = await Job.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isFeatured: true,
        featuredAt: new Date(),
        featuredExpiry,
      },
      { new: true }
    );
    
    return job;
  }

  // Remove featured status (Admin only)
  static async unfeatureJob(id: string): Promise<IJob | null> {
    const job = await Job.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isFeatured: false,
        featuredAt: null,
        featuredExpiry: null,
      },
      { new: true }
    );
    
    return job;
  }

  // Increment applications count (when someone applies)
  static async incrementApplicationsCount(jobId: string): Promise<void> {
    await Job.updateOne({ _id: jobId }, { $inc: { applicationsCount: 1 } });
  }
}