import twilio from 'twilio';

interface SendSMSOptions {
  to: string;
  from: string;
  message: string;
}

interface SendSMSResult {
  success: boolean;
  sid?: string;
  error?: string;
}

/**
 * Initialize Twilio client from environment variables
 */
function initializeTwilio() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error(
      'Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.'
    );
  }

  return twilio(accountSid, authToken);
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS(options: SendSMSOptions): Promise<SendSMSResult> {
  try {
    const client = initializeTwilio();

    const message = await client.messages.create({
      body: options.message,
      from: options.from,
      to: options.to,
    });

    return {
      success: true,
      sid: message.sid,
    };
  } catch (error) {
    console.error('Twilio error:', error);

    let errorMessage = 'Failed to send SMS';

    if (error instanceof Error) {
      if (error.message.includes('invalid')) {
        errorMessage = 'Invalid recipient number or sender ID';
      } else if (error.message.includes('authentication')) {
        errorMessage = 'Twilio authentication failed';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Validate Twilio credentials
 */
export async function validateCredentials(): Promise<boolean> {
  try {
    const client = initializeTwilio();
    const account = await client.api.accounts.list({ limit: 1 });
    return account.length > 0;
  } catch {
    return false;
  }
}
