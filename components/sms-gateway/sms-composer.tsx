'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { validateE164, validateSenderId, calculateSegments } from '@/lib/sms-utils';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SMSComposerProps {
  onSend: (data: { phoneNumber: string; senderId: string; message: string; mockMode?: boolean }) => Promise<void>;
  loading?: boolean;
  mockMode?: boolean;
}

export function SMSComposer({ onSend, loading = false, mockMode = false }: SMSComposerProps) {
  const [phone, setPhone] = useState('');
  const [senderId, setSenderId] = useState('');
  const [message, setMessage] = useState('');
  
  const [phoneError, setPhoneError] = useState('');
  const [senderIdError, setSenderIdError] = useState('');
  
  const segments = calculateSegments(message);
  const phoneValidation = validateE164(phone);
  const senderIdValidation = validateSenderId(senderId);

  const isFormValid =
    phoneValidation.valid &&
    senderIdValidation.valid &&
    message.trim().length > 0;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    
    if (value.trim()) {
      const validation = validateE164(value);
      setPhoneError(validation.valid ? '' : validation.error || '');
    } else {
      setPhoneError('');
    }
  };

  const handleSenderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSenderId(value);
    
    if (value) {
      const validation = validateSenderId(value);
      setSenderIdError(validation.valid ? '' : validation.error || '');
    } else {
      setSenderIdError('');
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!isFormValid) return;

    try {
      const { normalized } = validateE164(phone);
      await onSend({
        phoneNumber: normalized!,
        senderId: senderId.toUpperCase(),
        message: message.trim(),
        mockMode,
      });
      
      // Reset form on success
      setMessage('');
    } catch (error) {
      console.error('Send failed:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compose SMS</CardTitle>
        <CardDescription>
          {mockMode && <span className="text-amber-600">Mock Mode Enabled</span>}
          {!mockMode && 'Send SMS to international numbers'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recipient Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Recipient Phone (E.164)</Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={handlePhoneChange}
              className={phoneError ? 'border-red-500' : ''}
              disabled={loading}
            />
            {phoneValidation.valid && phone && (
              <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-600" />
            )}
            {phoneError && (
              <AlertCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-600" />
            )}
          </div>
          {phoneError && (
            <p className="text-sm text-red-600">{phoneError}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Format: +[country code][number]. Example: +1 (US), +44 (UK), +91 (India)
          </p>
        </div>

        {/* Sender ID */}
        <div className="space-y-2">
          <Label htmlFor="senderId">Sender ID (Alphanumeric)</Label>
          <div className="relative">
            <Input
              id="senderId"
              type="text"
              placeholder="COMPANY"
              value={senderId}
              onChange={handleSenderIdChange}
              maxLength={11}
              className={senderIdError ? 'border-red-500' : ''}
              disabled={loading}
            />
            <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
              {senderId.length}/11
            </span>
          </div>
          {senderIdError && (
            <p className="text-sm text-red-600">{senderIdError}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Display name for SMS (A-Z, 0-9 only, max 11 characters)
          </p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="message">Message</Label>
            <div className="text-sm text-muted-foreground">
              <span className={segments.charCount > segments.charsPerSegment * segments.segments ? 'text-amber-600' : ''}>
                {segments.charCount}
              </span>
              /{segments.charsPerSegment * segments.segments} chars ({segments.segments} segment{segments.segments !== 1 ? 's' : ''})
            </div>
          </div>
          <Textarea
            id="message"
            placeholder="Type your SMS message here..."
            value={message}
            onChange={handleMessageChange}
            disabled={loading}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Encoding: {segments.encoding} • {segments.segments > 1 && `${segments.segments} SMS (may incur multiple charges)`}
          </p>
        </div>

        {/* Info Box */}
        {segments.encoding === 'UCS-2' && (
          <div className="flex gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>Message contains special characters. Using Unicode encoding (70 chars/segment).</p>
          </div>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!isFormValid || loading}
          size="lg"
          className="w-full"
        >
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Sending...
            </>
          ) : (
            'Send SMS'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
