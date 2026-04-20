import { NextResponse } from 'next/server';

export class ApiResponse {
  static success(data: any, message = 'Success', status = 200) {
    return NextResponse.json(
      { success: true, message, data },
      { status }
    );
  }

  static error(message: string, status = 500, errors?: any) {
    return NextResponse.json(
      { success: false, message, errors },
      { status }
    );
  }
}