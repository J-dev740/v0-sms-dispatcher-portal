import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/send-sms
 * 
 * This is a Next.js API route that acts as a proxy to the backend Express server.
 * It validates the request and forwards it to the backend.
 * 
 * Frontend sends requests to: POST /api/send-sms
 * Which forwards to: POST http://backend-url/api/send-sms
 */

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.to || !body.from || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: to, from, message',
          code: 'INVALID_REQUEST',
        },
        { status: 400 }
      );
    }

    // Get backend URL from environment or use default
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:3001';

    // Forward request to backend
    const backendResponse = await fetch(`${backendUrl}/api/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Parse backend response
    const responseData = await backendResponse.json();

    // Return response
    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('API route error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage.includes('fetch')
          ? 'Backend service unavailable'
          : errorMessage,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

// Enable CORS-like behavior with OPTIONS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
