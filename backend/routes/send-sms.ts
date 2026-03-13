import { Request, Response } from 'express';
import { sendSMS } from '../services/twilio-service';
import { SendSMSRequest } from '../middleware/validation';

/**
 * POST /api/send-sms
 * Send SMS via Twilio
 */
export async function sendSMSRoute(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const validatedData = (req as any).validatedData as SendSMSRequest;

    // Send SMS via Twilio
    const result = await sendSMS({
      to: validatedData.to,
      from: validatedData.from,
      message: validatedData.message,
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        sid: result.sid,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        code: 'SMS_SEND_FAILED',
      });
    }
  } catch (error) {
    console.error('Route error:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to process SMS send request',
      code: 'INTERNAL_ERROR',
    });
  }
}
