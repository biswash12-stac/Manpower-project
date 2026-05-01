import Application from '@/src/models/application/applicantModel';
import Job from '@/src/models/job/jobModel';
import { Types } from 'mongoose';

export class ApplicationService {
  static async submit(data: any) {
    console.log("📝 ApplicationService.submit called with:", JSON.stringify(data, null, 2));

    // Check for duplicate
    const existing = await Application.findOne({
      jobId: data.jobId,
      email: data.email,
    });
    
    if (existing) {
      throw new Error('You have already applied for this position');
    }
    
    // Verify job exists
    const job = await Job.findById(data.jobId);
    if (!job) {
      throw new Error('Job not found or no longer accepting applications');
    }
    
    console.log("Job found:", job.title);
    
    // Handle experience for freshers
    let experienceValue = 0;
    if (!data.isFresher) {
      experienceValue = parseInt(data.experience) || 0;
    }
    
    // Create application
    const application = await Application.create({
     jobId: data.jobId,
    jobTitle: job.title,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    country: data.country,
    city: data.city || "",
    position: data.position,
    experience: data.experience || 0,
    skills: data.skills || [],
    coverLetter: data.coverLetter,
    isFresher: data.isFresher || false,
    // ✅ Store the document URLs
    documents: {
      photoUrl: data.documents?.photoUrl || null,
      passportUrl: data.documents?.passportUrl || null,
      certificateUrls: data.documents?.certificateUrls || [],
      cvUrl: data.documents?.cvUrl || null,
    },
    status: 'pending',
    appliedAt: new Date(),
    });

    
    
    console.log("Application created:", application._id);
    
    // Increment job application count
    await Job.findByIdAndUpdate(data.jobId, { $inc: { applicationsCount: 1 } });
    
    return application;
  }
  
  static async findAll(params: any) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, params.limit || 20);
    const skip = (page - 1) * limit;
    
    const query: any = {};
    if (params.status) query.status = params.status;
    if (params.jobId) query.jobId = params.jobId;
    
    if (params.search) {
      query.$or = [
        { firstName: { $regex: params.search, $options: 'i' } },
        { lastName: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
      ];
    }
    
    const [data, total] = await Promise.all([
      Application.find(query)
        .populate('jobId', 'title company')
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Application.countDocuments(query),
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
  
  static async findById(id: string) {
    const application = await Application.findById(id)
      .populate('jobId', 'title company location')
      .populate('reviewedBy', 'name email')
      .lean();
    return application;
  }
  
  static async updateStatus(id: string, status: string, adminId: string, notes?: string) {
    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        reviewedBy: new Types.ObjectId(adminId),
        reviewNotes: notes,
        reviewedAt: new Date(),
      },
      { new: true }
    );
    return application;
  }
}