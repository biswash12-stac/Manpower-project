import { NextRequest } from 'next/server';
import { connectDB } from '@/src/config/database';
import Contact from '@/src/models/contact/contact';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';
import mongoose from 'mongoose';

// PATCH /api/v1/contacts/[id]/status - Admin only
export async function PATCH(
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
    
    const { status } = await req.json();
    
    // Validate status
    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return ApiResponse.error('Invalid status', 400);
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { 
        status,
        ...(status === 'replied' && { repliedBy: user.id, repliedAt: new Date() })
      },
      { new: true }
    );
    
    if (!contact) {
      return ApiResponse.error('Contact not found', 404);
    }
    
    return ApiResponse.success(contact, `Contact marked as ${status}`);
    
  } catch (error) {
    console.error('Update contact status error:', error);
    return ApiResponse.error('Failed to update contact status', 500);
  }
}