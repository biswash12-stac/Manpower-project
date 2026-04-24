import { NextResponse } from 'next/server';

export class ApiResponse {
  static success<T>(
    data: T, 
    message: string = 'Success', 
    status: number = 200,
    meta?: any
  ): NextResponse {
    return NextResponse.json(
      { 
        success: true, 
        message, 
        data,
        ...(meta && { meta })
      },
      { status }
    );
  }

  static error(message: string, status: number = 500, errors?: any): NextResponse {
    return NextResponse.json(
      { 
        success: false, 
        message,
        ...(errors && { errors })
      },
      { status }
    );
  }
}                                                                                                                               