import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const SendSMSSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format (must be E.164)'),
  message: z.string().min(1).max(1600),
  senderId: z.string().min(1).max(11),
  mockMode: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = SendSMSSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { phoneNumber, message, senderId, mockMode } = validation.data

    // Mock mode returns success without sending
    if (mockMode) {
      return NextResponse.json({
        success: true,
        messageId: `mock_${Date.now()}`,
        status: 'delivered',
        phoneNumber,
        message,
        senderId,
        timestamp: new Date().toISOString(),
        isMockMode: true,
      })
    }

    // Check for Telynx API key
    const telynxApiKey = process.env.TELYNX_API_KEY
    if (!telynxApiKey) {
      console.error('[v0] TELYNX_API_KEY is not configured')
      return NextResponse.json(
        { error: 'SMS service not configured. Please add TELYNX_API_KEY to environment variables.' },
        { status: 500 }
      )
    }

    // Call Telynx API
    const telynxResponse = await fetch('https://api.telynx.com/v1/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${telynxApiKey}`,
      },
      body: JSON.stringify({
        to: phoneNumber,
        from: senderId,
        text: message,
      }),
    })

    if (!telynxResponse.ok) {
      const errorData = await telynxResponse.json().catch(() => ({}))
      console.error('[v0] Telynx API error:', {
        status: telynxResponse.status,
        error: errorData,
      })

      return NextResponse.json(
        {
          error: 'Failed to send SMS',
          details: errorData?.message || 'Unknown error from SMS provider',
        },
        { status: telynxResponse.status }
      )
    }

    const telynxData = await telynxResponse.json()

    // Return success response
    return NextResponse.json({
      success: true,
      messageId: telynxData.messageId || telynxData.id,
      status: 'sent',
      phoneNumber,
      message,
      senderId,
      timestamp: new Date().toISOString(),
      provider: 'telynx',
    })
  } catch (error) {
    console.error('[v0] SMS API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
