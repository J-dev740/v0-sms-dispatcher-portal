// GSM-7 character set (140 characters)
const GSM7_CHARSET = '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1bÆæßÉ!\"#¤%&\'()*+,-./:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';
const GSM7_EXTENDED_CHARSET = '^{}\\[~]|€';

/**
 * Detects if a string can be encoded as GSM-7 or requires UCS-2 (Unicode)
 * GSM-7: 160 chars per segment, 153 in multi-part
 * UCS-2: 70 chars per segment, 67 in multi-part
 */
export function detectEncoding(text: string): 'GSM-7' | 'UCS-2' {
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Check extended GSM-7 characters (these are actually 2 chars in encoding)
    if (GSM7_EXTENDED_CHARSET.includes(char)) {
      continue;
    }
    
    // Check basic GSM-7
    if (!GSM7_CHARSET.includes(char)) {
      return 'UCS-2';
    }
  }
  
  return 'GSM-7';
}

/**
 * Calculates the number of SMS segments needed
 * Accounts for User Data Header in multi-part messages
 */
export function calculateSegments(text: string): {
  segments: number;
  charsPerSegment: number;
  encoding: 'GSM-7' | 'UCS-2';
  charCount: number;
} {
  if (!text) {
    return {
      segments: 0,
      charsPerSegment: 160,
      encoding: 'GSM-7',
      charCount: 0,
    };
  }

  const encoding = detectEncoding(text);
  
  // Calculate actual text length considering extended GSM-7 chars
  let actualLength = text.length;
  for (const char of text) {
    if (GSM7_EXTENDED_CHARSET.includes(char)) {
      actualLength++; // Extended chars take 2 bytes
    }
  }

  if (encoding === 'GSM-7') {
    const singleSegmentLimit = 160;
    const multiSegmentLimit = 153; // 160 - 7 for UDH

    if (actualLength <= singleSegmentLimit) {
      return {
        segments: 1,
        charsPerSegment: singleSegmentLimit,
        encoding,
        charCount: text.length,
      };
    }

    const segments = Math.ceil(actualLength / multiSegmentLimit);
    return {
      segments,
      charsPerSegment: multiSegmentLimit,
      encoding,
      charCount: text.length,
    };
  } else {
    // UCS-2 (Unicode)
    const singleSegmentLimit = 70;
    const multiSegmentLimit = 67; // 70 - 3 for UDH

    if (text.length <= singleSegmentLimit) {
      return {
        segments: 1,
        charsPerSegment: singleSegmentLimit,
        encoding,
        charCount: text.length,
      };
    }

    const segments = Math.ceil(text.length / multiSegmentLimit);
    return {
      segments,
      charsPerSegment: multiSegmentLimit,
      encoding,
      charCount: text.length,
    };
  }
}

/**
 * Validates E.164 phone format
 * Format: +[country code][subscriber number]
 * Total: 1-15 digits after country code
 */
export function validateE164(phone: string): {
  valid: boolean;
  normalized?: string;
  error?: string;
} {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Remove spaces and hyphens
  const cleaned = phone.replace(/[\s\-]/g, '');

  // E.164 regex: optional +, then 1-15 digits
  const e164Regex = /^\+?[1-9]\d{1,14}$/;

  if (!e164Regex.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid phone number format. Use E.164 format (e.g., +1234567890)',
    };
  }

  // Normalize with + prefix
  const normalized = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;

  return {
    valid: true,
    normalized,
  };
}

/**
 * Validates alphanumeric sender ID
 * Must be 1-11 characters, A-Z and 0-9 only
 */
export function validateSenderId(senderId: string): {
  valid: boolean;
  error?: string;
} {
  if (!senderId) {
    return { valid: false, error: 'Sender ID is required' };
  }

  if (senderId.length > 11) {
    return { valid: false, error: 'Sender ID must be 11 characters or less' };
  }

  if (!/^[A-Z0-9]+$/i.test(senderId)) {
    return {
      valid: false,
      error: 'Sender ID can only contain letters (A-Z) and numbers (0-9)',
    };
  }

  return { valid: true };
}

/**
 * Formats phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  const { normalized } = validateE164(phone);
  if (!normalized) return phone;

  // Extract country code and number
  const match = normalized.match(/^\+(\d{1,3})(\d+)$/);
  if (!match) return normalized;

  const [, countryCode, number] = match;
  
  // Format differently based on country code length
  if (countryCode.length === 1) {
    // US-style: +1 (XXX) XXX-XXXX
    return `+${countryCode} (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
  }

  // International style: +CC XXXXX XXXXX
  const halfPoint = Math.ceil(number.length / 2);
  return `+${countryCode} ${number.slice(0, halfPoint)} ${number.slice(halfPoint)}`;
}
