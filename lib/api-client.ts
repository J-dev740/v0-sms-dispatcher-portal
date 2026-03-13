/**
 * API client for SMS Gateway
 * Handles requests to backend API with error handling
 */

export interface SendSMSRequest {
  to: string; // E.164 format
  from: string; // Alphanumeric sender ID
  message: string;
}

export interface SendSMSResponse {
  success: boolean;
  sid?: string; // Twilio message SID
  error?: string;
  code?: string;
}

export class APIError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Create an API client with configurable base URL
 */
export function createAPIClient(baseUrl: string) {
  // Normalize URL
  const normalizedUrl = baseUrl.replace(/\/$/, '');

  return {
    /**
     * Send SMS via backend API
     */
    async sendSMS(data: SendSMSRequest): Promise<SendSMSResponse> {
      try {
        const response = await fetch(`${normalizedUrl}/api/send-sms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const body = await response.json();

        if (!response.ok) {
          throw new APIError(
            body.code || 'SEND_FAILED',
            response.status,
            body.error || 'Failed to send SMS'
          );
        }

        return body;
      } catch (error) {
        if (error instanceof APIError) {
          throw error;
        }

        if (error instanceof TypeError) {
          throw new APIError(
            'NETWORK_ERROR',
            0,
            'Network error. Check API URL and CORS configuration.'
          );
        }

        throw new APIError('UNKNOWN_ERROR', 500, 'Unknown error occurred');
      }
    },

    /**
     * Test API connection
     */
    async testConnection(): Promise<boolean> {
      try {
        const response = await fetch(`${normalizedUrl}/health`, {
          method: 'GET',
        });
        return response.ok;
      } catch {
        return false;
      }
    },
  };
}

/**
 * Default API client using environment or localStorage config
 */
export function getDefaultAPIClient(): ReturnType<typeof createAPIClient> {
  // Try environment variable first (for SSR)
  const envUrl = typeof window === 'undefined'
    ? process.env.API_BASE_URL
    : null;

  // Fall back to localStorage
  let baseUrl = envUrl || '';
  if (!baseUrl && typeof window !== 'undefined') {
    baseUrl = localStorage.getItem('sms_api_base_url') || 'http://localhost:3001';
  }

  return createAPIClient(baseUrl || 'http://localhost:3001');
}
