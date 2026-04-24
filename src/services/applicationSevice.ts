import Application, { IApplication } from '@/src/models/application/applicantModel';
import Job from '@/src/models/job/jobModel';
import { Types } from 'mongoose';
import { sendEmail, emailTemplates } from '@/src/config/email';

export class ApplicationService {
  // Submit a new application (Public)
  static async submit(data: Partial<IApplication>): Promise<IApplication> {
    // Check for duplicate application
    const existing = await Application.findOne({
      jobId: data.jobId,
      email: data.email,
    });
    
    if (existing) {
      throw new Error('You have already applied for this position');
    }
    
    // Verify job exists and is active
    const job = await Job.findOne({
      _id: data.jobId,
      status: 'active',
      isDeleted: false,
    });
    
    if (!job) {
      throw new Error('Job not found or no longer accepting applications');
    }
    
    // Create application
    const application = await Application.create(data);
    
    // Increment application count on job
    await Job.updateOne(
      { _id: data.jobId },
      { $inc: { applicationsCount: 1 } }
    );
    
    // Send email notifications (don't await - fire and forget for better performance)
    Promise.all([
      // Send confirmation email to candidate
      sendEmail({
        to: data.email!,
        subject: 'Application Received - Gulf Empire',
        html: emailTemplates.applicationConfirmation(
          `${data.firstName} ${data.lastName}`, 
          data.position || job.title
        ),
      }).catch(err => console.error('Candidate email failed:', err)),
      
      // Send notification to admin
      sendEmail({
        to: process.env.ADMIN_EMAIL!,
        subject: 'New Job Application Received',
        html: emailTemplates.adminNewApplication(
          `${data.firstName} ${data.lastName}`,
          data.position || job.title,
          data.email!
        ),
      }).catch(err => console.error('Admin email failed:', err)),
    ]);
    
    return application;
  }
  
  // Get all applications (Admin only)
  static async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    jobId?: string;
    search?: string;
  }) {
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
        .populate('jobId', 'title company location')
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
  
  // Get single application (Admin only)
  static async findById(id: string): Promise<IApplication | null> {
    const application = await Application.findById(id)
      .populate('jobId', 'title company location salary description')
      .populate('reviewedBy', 'name email')
      .lean();
    return application;
  }
  
  // Update application status (Admin only)
  static async updateStatus(
    id: string,
    status: IApplication['status'],
    adminId: string,
    notes?: string
  ): Promise<IApplication | null> {
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
    
    // Send status update email to candidate (don't await)
    if (application && application.email) {
      sendEmail({
        to: application.email,
        subject: `Application Status Update - ${status.toUpperCase()}`,
        html: emailTemplates.statusUpdate(
          `${application.firstName} ${application.lastName}`,
          application.position,
          status,
          notes
        ),
      }).catch(err => console.error('Status update email failed:', err));
    }
    
    return application;
  }
  
  // Get applications by email (for tracking)
  static async findByEmail(email: string): Promise<IApplication[]> {
    const applications = await Application.find({ email })
      .populate('jobId', 'title company location')
      .sort({ appliedAt: -1 })
      .lean();
    return applications;
  }
  
  // Get application statistics for dashboard
  static async getStats() {
    const [total, pending, reviewing, shortlisted, hired, rejected, today] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'reviewing' }),
      Application.countDocuments({ status: 'shortlisted' }),
      Application.countDocuments({ status: 'hired' }),
      Application.countDocuments({ status: 'rejected' }),
      Application.countDocuments({
        appliedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
    ]);
    
    return { total, pending, reviewing, shortlisted, hired, rejected, today };
  }
}