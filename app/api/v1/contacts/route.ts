import { NextRequest } from 'next/server';
import { ContactService } from '@/src/services/contactService';
import { getAuthUser } from '@/src/middleware/auth.middleware';
import { ApiResponse } from '@/src/utils/apiResponse';
import { strictRateLimit } from '@/src/middleware/ratelimitMIddleware';
// POST /api/v1/contacts - Public (submit contact form)
export async function POST(req: NextRequest) {
  try {
    const rateLimitResult = await strictRateLimit(req);
    if (rateLimitResult) return rateLimitResult;
    const body = await req.json();
    
    // Validate required fields
    const required = ['name', 'email', 'subject', 'message'];
    for (const field of required) {
      if (!body[field]) {
        return ApiResponse.error(`${field} is required`, 400);
      }
    }
    
    const contact = await ContactService.submit(body);
    
    return ApiResponse.success(contact, 'Message sent successfully', 201);
    
  } catch (error) {
    console.error('Submit contact error:', error);
    return ApiResponse.error('Failed to send message', 500);
  }
}

// GET /api/v1/contacts - Admin only
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return ApiResponse.error('Unauthorized', 401);
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    
    const result = await ContactService.findAll({ page, limit, status, search });
    
    return ApiResponse.success(result.data, 'Contacts retrieved', 200, result.pagination);
    
  } catch (error) {
    console.error('Get contacts error:', error);
    return ApiResponse.error('Failed to fetch contacts', 500);
  }
}