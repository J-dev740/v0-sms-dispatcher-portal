/**
 * API client for SMS Gateway with Telynx
 * Handles requests to Vercel Edge Function with error handling
 */

export interface SendSMSRequest {
  phoneNumber: string // E.164 format (+1234567890)
  message: string
  senderId: string // Alphanumeric sender ID (max 11 chars)
  mockMode?: boolean
}

export interface SendSMSResponse {
  success: boolean
  messageId?: string
  status?: string
  error?: string
  details?: string
  timestamp?: string
  isMockMode?: boolean
  provider?: string
}

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Send SMS using Vercel Edge Function (Telynx backend)
 */
export async function sendSMS(data: SendSMSRequest): Promise<SendSMSResponse> {
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const body = await response.json()

    if (!response.ok) {
      throw new APIError(response.status, body.error || 'Failed to send SMS')
    }

    return body
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    if (error instanceof TypeError) {
      throw new APIError(0, 'Network error - unable to reach SMS service')
    }

    throw new APIError(500, 'Unknown error occurred')
  }
}
