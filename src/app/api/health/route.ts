import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const environment: any = {
      NODE_ENV: process.env.NODE_ENV,
      JWT_SECRET_CONFIGURED: !!process.env.JWT_SECRET,
      JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0,
      DATABASE_URL_CONFIGURED: !!process.env.DATABASE_URL,
      SUPABASE_URL_CONFIGURED: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY_CONFIGURED: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY_CONFIGURED: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    if (process.env.JWT_SECRET) {
      try {
        const jwt = require('jsonwebtoken');
        const testPayload = { test: true };
        const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1m' });
        jwt.verify(token, process.env.JWT_SECRET);
        environment.JWT_FUNCTIONALITY = 'working';
      } catch (jwtError: any) {
        environment.JWT_FUNCTIONALITY = 'failed';
        environment.JWT_ERROR = jwtError.message;
      }
    } else {
      environment.JWT_FUNCTIONALITY = 'not_configured';
    }

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment
    };
    
    return NextResponse.json(health);
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: 'error', 
        error: 'Health check failed',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
