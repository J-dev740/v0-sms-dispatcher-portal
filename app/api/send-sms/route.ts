import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import twilio from 'twilio'

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

    // Check for Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error('[v0] Twilio credentials not configured')
      return NextResponse.json(
        { error: 'SMS service not configured. Please add Twilio credentials to environment variables.' },
        { status: 500 }
      )
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken)

    // Send SMS via Twilio
    const twilioMessage = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    })

    // Return success response
    return NextResponse.json({
      success: true,
      messageId: twilioMessage.sid,
      status: twilioMessage.status,
      phoneNumber,
      message,
      senderId,
      timestamp: new Date().toISOString(),
      provider: 'twilio',
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
