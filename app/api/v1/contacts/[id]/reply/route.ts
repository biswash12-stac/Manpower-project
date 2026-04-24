import { NextRequest } from 'next/server';
import { ContactService } from '@/src/services/contactService';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';
import mongoose from 'mongoose';

// POST /api/v1/contacts/[id]/reply - Admin only
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ApiResponse.error('Invalid contact ID', 400);
    }
    
    const { replyMessage } = await req.json();
    
    if (!replyMessage) {
      return ApiResponse.error('Reply message is required', 400);
    }
    
    const contact = await ContactService.reply(id, replyMessage, user.id);
    
    if (!contact) {
      return ApiResponse.error('Contact not found', 404);
    }
    
    return ApiResponse.success(contact, 'Reply sent successfully');
    
  } catch (error) {
    console.error('Reply to contact error:', error);
    return ApiResponse.error('Failed to send reply', 500);
  }
}