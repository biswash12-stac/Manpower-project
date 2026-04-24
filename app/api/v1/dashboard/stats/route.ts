import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Job from '@/src/models/job/jobModel';
import Application from '@/src/models/application/applicantModel';
import Contact from '@/src/models/contact/contact';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }
    
    await connectDB();
    
    // Get date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    // Run all queries in parallel
    const [
      // Job stats
      totalJobs,
      activeJobs,
      featuredJobs,
      totalJobViews,
      // Application stats
      totalApplications,
      pendingApplications,
      approvedApplications,
      todayApplications,
      thisMonthApplications,
      // Contact stats
      totalContacts,
      unreadContacts,
      todayContacts,
      // Recent data
      recentApplications,
      recentJobs,
    ] = await Promise.all([
      // Job counts
      Job.countDocuments({ isDeleted: false }),
      Job.countDocuments({ status: 'active', isDeleted: false }),
      Job.countDocuments({ isFeatured: true, isDeleted: false }),
      Job.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      
      // Application counts
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: { $in: ['shortlisted', 'hired'] } }),
      Application.countDocuments({ appliedAt: { $gte: today } }),
      Application.countDocuments({ appliedAt: { $gte: thisMonth } }),
      
      // Contact counts
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ createdAt: { $gte: today } }),
      
      // Recent applications (last 5)
      Application.find()
        .sort({ appliedAt: -1 })
        .limit(5)
        .populate('jobId', 'title')
        .select('firstName lastName email status appliedAt jobId')
        .lean(),
      
      // Recent jobs (last 5)
      Job.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title location type status views applicationsCount createdAt')
        .lean(),
    ]);
    
    const totalViews = totalJobViews[0]?.total || 0;
    
    return ApiResponse.success({
      overview: {
        totalJobs,
        activeJobs,
        featuredJobs,
        totalJobViews: totalViews,
        totalApplications,
        pendingApplications,
        approvedApplications,
        totalContacts,
        unreadContacts,
      },
      trends: {
        applicationsToday: todayApplications,
        applicationsThisMonth: thisMonthApplications,
        contactsToday: todayContacts,
      },
      recent: {
        applications: recentApplications,
        jobs: recentJobs,
      },
    }, 'Dashboard statistics retrieved');
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return ApiResponse.error('Failed to fetch dashboard statistics', 500);
  }
}