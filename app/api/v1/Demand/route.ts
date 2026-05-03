import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Demand from '@/src/models/demand/demand';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';

// GET /api/v1/Demand - Public (shows only last 10 days demands)
// GET /api/v1/Demand?admin=true - Admin (shows all demands)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const isAdmin = searchParams.get('admin') === 'true';  // ← ADD THIS LINE
    
    // Calculate date 10 days ago (only needed for public)
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    // Build query based on whether it's admin or public
    const query: any = {
      isDeleted: false,
    };
    
    if (isAdmin) {
      // ADMIN: No filters - see ALL demands (active, closed, draft, all dates)
      // query stays as { isDeleted: false } only
    } else {
      // PUBLIC: Only active demands from last 10 days
      query.status = 'active';
      query.createdAt = { $gte: tenDaysAgo };
    }
    
    const skip = (page - 1) * limit;
    
    const [demands, total] = await Promise.all([
      Demand.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Demand.countDocuments(query),
    ]);
    
    return ApiResponse.success({
      demands,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      cutoffDate: tenDaysAgo,
    }, 'Demands retrieved');
    
  } catch (error) {
    console.error('GET /Demand error:', error);
    return ApiResponse.error('Failed to fetch demands', 500);
  }
}

// POST /api/v1/Demand - Admin only (no date filter for admin)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }
    
    const body = await req.json();
    
    const required = ['title', 'category', 'quantity', 'location', 'deadline'];
    for (const field of required) {
      if (!body[field]) {
        return ApiResponse.error(`${field} is required`, 400);
      }
    }
    
    const demand = await Demand.create({
      ...body,
      postedBy: user.id,
    });
    
    return ApiResponse.success(demand, 'Demand created successfully', 201);
    
  } catch (error) {
    console.error('POST /Demand error:', error);
    return ApiResponse.error('Failed to create demand', 500);
  }
}