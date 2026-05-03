import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Demand from '@/src/models/demand/demand';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';
import mongoose from 'mongoose';

// GET /api/v1/demands/[id] - Public
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ApiResponse.error('Invalid demand ID', 400);
    }
    
    const demand = await Demand.findOne({ _id: id, isDeleted: false }).lean();
    
    if (!demand) {
      return ApiResponse.error('Demand not found', 404);
    }
    
    return ApiResponse.success(demand, 'Demand retrieved');
    
  } catch (error) {
    console.error('GET /Demand/[id] error:', error);
    return ApiResponse.error('Failed to fetch demand', 500);
  }
}

// PUT /api/v1/Demand/[id] - Admin only
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ApiResponse.error('Invalid demand ID', 400);
    }
    
    const body = await req.json();
    
    const demand = await Demand.findOneAndUpdate(
      { _id: id, isDeleted: false },
      body,
      { new: true, runValidators: true }
    );
    
    if (!demand) {
      return ApiResponse.error('Demand not found', 404);
    }
    
    return ApiResponse.success(demand, 'Demand updated successfully');
    
  } catch (error) {
    console.error('PUT /demands/[id] error:', error);
    return ApiResponse.error('Failed to update demand', 500);
  }
}

// DELETE /api/v1/demands/[id] - Admin only
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ApiResponse.error('Invalid demand ID', 400);
    }
    
    const demand = await Demand.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    
    if (!demand) {
      return ApiResponse.error('Demand not found', 404);
    }
    
    return ApiResponse.success(null, 'Demand deleted successfully');
    
  } catch (error) {
    console.error('DELETE /demands/[id] error:', error);
    return ApiResponse.error('Failed to delete demand', 500);
  }
}