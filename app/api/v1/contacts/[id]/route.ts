import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Contact from '@/src/models/contact/contact';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';
import mongoose from 'mongoose';

// DELETE /api/v1/contacts/[id] - Admin only
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
      return ApiResponse.error('Invalid contact ID', 400);
    }
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return ApiResponse.error('Contact not found', 404);
    }
    
    return ApiResponse.success(null, 'Contact deleted successfully');
    
  } catch (error) {
    console.error('Delete contact error:', error);
    return ApiResponse.error('Failed to delete contact', 500);
  }
}

// GET /api/v1/contacts/[id] - Admin only
export async function GET(
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
      return ApiResponse.error('Invalid contact ID', 400);
    }
    
    const contact = await Contact.findById(id)
      .populate('repliedBy', 'name email')
      .lean();
    
    if (!contact) {
      return ApiResponse.error('Contact not found', 404);
    }
    
    return ApiResponse.success(contact, 'Contact retrieved');
    
  } catch (error) {
    console.error('Get contact error:', error);
    return ApiResponse.error('Failed to fetch contact', 500);
  }
}