import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Validation schema for SMS send requests
const SendSMSSchema = z.object({
  to: z
    .string()
    .min(1, 'Recipient phone number is required')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (E.164)'),
  from: z
    .string()
    .min(1, 'Sender ID is required')
    .max(11, 'Sender ID must be 11 characters or less')
    .regex(/^[A-Z0-9]+$/i, 'Sender ID can only contain letters and numbers'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(4000, 'Message is too long'),
});

export type SendSMSRequest = z.infer<typeof SendSMSSchema>;

/**
 * Middleware to validate SMS send request
 */
export function validateInput(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Parse and validate request body
    const result = SendSMSSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessage = Object.values(errors)
        .flat()
        .join(', ') || 'Validation failed';

      res.status(400).json({
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR',
      });
      return;
    }

    // Attach validated data to request
    (req as any).validatedData = result.data;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid request format',
      code: 'INVALID_FORMAT',
    });
  }
}
