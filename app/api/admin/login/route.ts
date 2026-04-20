import { NextResponse } from 'next/server';
import Admin from '@/src/models/admin';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const admin = await Admin.findOne({ email, isActive: true }).select('+password');

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    admin.lastLogin = new Date();
    await admin.save();

    return NextResponse.json({
      user: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login failed', error);

    return NextResponse.json(
      { message: 'Unable to log in right now.' },
      { status: 500 }
    );
  }
}
