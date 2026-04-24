import Contact, { IContact } from '@/src/models/contact/contact';
import { Types } from 'mongoose';

export class ContactService {
  // Submit a contact form (Public)
  static async submit(data: Partial<IContact>): Promise<IContact> {
    const contact = await Contact.create(data);
    return contact;
  }
  
  // Get all contacts (Admin only)
  static async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, params.limit || 20);
    const skip = (page - 1) * limit;
    
    const query: any = {};
    
    if (params.status) query.status = params.status;
    
    if (params.search) {
      query.$or = [
        { name: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
        { message: { $regex: params.search, $options: 'i' } },
      ];
    }
    
    const [data, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('repliedBy', 'name email')
        .lean(),
      Contact.countDocuments(query),
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
  
  // Get single contact (Admin only)
  static async findById(id: string): Promise<IContact | null> {
    const contact = await Contact.findById(id)
      .populate('repliedBy', 'name email')
      .lean();
    return contact;
  }
  
  // Mark as read (Admin only)
  static async markAsRead(id: string): Promise<IContact | null> {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );
    return contact;
  }
  
  // Reply to contact (Admin only)
  static async reply(
    id: string,
    replyMessage: string,
    adminId: string
  ): Promise<IContact | null> {
    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        status: 'replied',
        repliedBy: new Types.ObjectId(adminId),
        replyMessage,
        repliedAt: new Date(),
      },
      { new: true }
    );
    return contact;
  }
  
  // Archive contact (Admin only)
  static async archive(id: string): Promise<IContact | null> {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true }
    );
    return contact;
  }
  
  // Delete contact (Admin only)
  static async delete(id: string): Promise<boolean> {
    const result = await Contact.findByIdAndDelete(id);
    return !!result;
  }
  
static async getStats() {
  const [total, newCount, read, replied, today] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'new' }),
    Contact.countDocuments({ status: 'read' }),
    Contact.countDocuments({ status: 'replied' }),
    Contact.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
  ]);

  return { total, new: newCount, read, replied, today };
}
}