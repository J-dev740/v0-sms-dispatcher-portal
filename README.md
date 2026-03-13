# SMS Gateway Portal - Production Ready

A modern, full-stack SMS gateway built with Next.js, Vercel Edge Functions, and Telynx. Send international SMS with alphanumeric sender IDs, real-time character counting, and session logging.

## Features

✅ **International SMS** - Send to any country using E.164 format  
✅ **Alphanumeric Sender ID** - Brand your messages (11 chars max)  
✅ **Smart Segmentation** - Automatic GSM-7/Unicode detection  
✅ **Device Preview** - See how messages appear on phones  
✅ **Session Logs** - Track all sent messages  
✅ **Mock Mode** - Test without SMS credits  
✅ **Real-time Validation** - E.164 phone format checking  
✅ **Serverless Backend** - Vercel Edge Functions, no separate server  
✅ **Production Ready** - Input validation, error handling, security

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Vercel Edge Functions (serverless)
- **SMS Provider**: Telynx API
- **Deployment**: Vercel (frontend + backend)

## Quick Start

### 1. Local Development

#### Install Dependencies
```bash
pnpm install
```

#### Run Locally
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Test with Mock Mode
1. Open http://localhost:3000
2. Go to Settings tab
3. Enable Mock Mode
4. Send test messages (no credentials needed!)
5. View messages in Session Logs with "Mock" badge

### 2. Deploy to Vercel

#### Push to GitHub
```bash
git add .
git commit -m "SMS Gateway Portal"
git push origin main
```

#### Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Deploy"

#### Add Telynx API Key
1. In Vercel project settings, go to "Environment Variables"
2. Add variable name: `TELYNX_API_KEY`
3. Add variable value: Your Telynx API key
4. Click "Save"
5. Redeploy the project

### 3. Get Telynx API Key

1. Sign up at [telynx.com](https://telynx.com)
2. Go to API settings in dashboard
3. Create new API key
4. Copy and add to Vercel environment variables

## Project Structure

```
├── app/
│   ├── api/
│   │   └── send-sms/route.ts    # Vercel Edge Function (Telynx backend)
│   ├── page.tsx                 # Main dashboard
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Tailwind styles
├── components/sms-gateway/
│   ├── sms-composer.tsx         # Input form
│   ├── device-preview.tsx       # iPhone mockup
│   ├── session-logs.tsx         # Message history
│   └── settings-panel.tsx       # Configuration
├── lib/
│   ├── sms-utils.ts             # GSM/Unicode detection, validation
│   └── api-client.ts            # Fetch wrapper for /api/send-sms
├── public/                       # Static assets
└── README.md                     # This file
```

## API Documentation

### POST `/api/send-sms`

Send an SMS via Telynx Edge Function.

**Request**:
```json
{
  "phoneNumber": "+1234567890",    // E.164 format (required)
  "message": "Hello world",        // 1-1600 chars (required)
  "senderId": "COMPANY",           // Alphanumeric, max 11 chars (required)
  "mockMode": false                // Test without credits (optional)
}
```

**Response (Success)**:
```json
{
  "success": true,
  "messageId": "msg_abc123def456",
  "status": "sent",
  "timestamp": "2024-03-13T10:30:00Z",
  "provider": "telynx"
}
```

**Response (Error)**:
```json
{
  "error": "Invalid phone number format",
  "details": "Must be E.164 format (+1234567890)"
}
```

**Status Codes**:
- `200`: SMS sent successfully
- `400`: Invalid request parameters
- `500`: Server error or Telynx API failure

## Usage Examples

### Send SMS from Frontend

```typescript
import { sendSMS } from '@/lib/api-client';

const response = await sendSMS({
  phoneNumber: '+1234567890',
  message: 'Your confirmation code is: 123456',
  senderId: 'ACME',
  mockMode: false
});

if (response.success) {
  console.log('Sent:', response.messageId);
}
```

### International Phone Numbers

```
US:      +1 + number (e.g., +12125551234)
UK:      +44 + number (e.g., +441234567890)
India:   +91 + number (e.g., +919876543210)
Japan:   +81 + number (e.g., +8190xxxxxxxx)
Brazil:  +55 + number (e.g., +5511xxxxxxxx)
```

### Message Segmentation

- **GSM-7** (A-Z, 0-9, @, etc.): **160 chars** per segment
- **Unicode** (emojis, accents): **70 chars** per segment
- Multi-part automatically calculated for long messages
- Auto-detected based on message content

## Configuration

### Frontend Settings
- **Mock Mode**: Toggle in Settings to test without SMS credits
- **Integration Status**: Shows Telynx connection status
- **Device Preview**: Real-time iPhone mockup of messages
- **Session Logs**: Persistent message history in browser

### Environment Variables

| Variable | Description | Required | Where |
|----------|-------------|----------|-------|
| `TELYNX_API_KEY` | Telynx API authentication key | ✅ Prod only | Vercel env vars |

**Note**: The API key is used server-side only in Vercel Edge Functions. No exposure to client.

## Security

- ✅ API keys stored server-side only (Vercel environment variables)
- ✅ Input validation with Zod schemas (frontend + backend)
- ✅ E.164 phone number format validation
- ✅ Alphanumeric sender ID validation (A-Z, 0-9 only)
- ✅ Message length validation (1-1600 characters)
- ✅ Vercel Edge Function isolation
- ✅ No sensitive data in client-side code
- ✅ HTTPS enforced by Vercel

## Testing

### Mock Mode (No Credentials Needed)
1. Enable "Mock Mode" in Settings tab
2. Send test messages without SMS credits
3. Messages appear with "Mock" badge in Session Logs
4. Perfect for UI testing and development

### Real SMS Testing
1. Add `TELYNX_API_KEY` to Vercel environment variables
2. Disable Mock Mode in Settings
3. Send SMS to verify phone numbers
4. Check Telynx dashboard for delivery status

### Validation Testing
- **Invalid phone**: Try "123" or "not-a-number" → Shows error
- **Short number**: Try "+1" → Fails E.164 validation
- **Long sender ID**: Try "ABCDEFGHIJKLMNOP" → Gets truncated
- **Special chars**: Try "Hello 🎉!" → Unicode detection triggers 70-char limit

## Performance

- **Frontend**: Instant UI via React + Tailwind
- **Backend**: Vercel Edge Functions with 0ms cold starts
- **Validation**: Input validation before API call
- **Caching**: Browser localStorage for settings and logs
- **Deployment**: Global CDN via Vercel

## Troubleshooting

### "SMS service not configured"
- Add `TELYNX_API_KEY` to Vercel environment variables
- Wait 1-2 minutes for deployment to update
- Check Vercel Deployments tab for completion

### "Invalid phone number format"
- Use E.164 format: `+[country code][number]`
- ✅ Correct: `+12125551234`, `+441234567890`
- ❌ Wrong: `1234567890`, `+1-212-555-1234`

### "Messages not being sent (not in mock mode)"
- Verify Telynx API key is valid
- Check Telynx account has SMS balance
- View Vercel function logs for details
- Try Mock Mode to test UI without API key

### Session Logs disappear on refresh
- Logs stored in browser localStorage (persistent)
- Clearing browser data removes logs
- Use browser DevTools to inspect `sms_logs` value

## Customization

### Add User Authentication
1. Integrate Supabase or Auth.js
2. Protect `/api/send-sms` endpoint
3. Store user-specific settings/logs

### Add Database for Message History
1. Use Neon or Supabase PostgreSQL
2. Store sent messages for audit trail
3. Add delivery status tracking

### Support Multiple Sender IDs
- Modify `app/api/send-sms/route.ts` to validate sender list
- Load sender IDs from environment or database
- Return 400 for unauthorized senders

## Next Steps

- ✅ Deploy to production on Vercel
- ✅ Get Telynx API key and add to env vars
- ✅ Test with Mock Mode first
- ✅ Send real SMS with Telynx
- ✅ Monitor usage in Telynx dashboard
- ✅ Add database for message persistence
- ✅ Implement user authentication

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Telynx API**: https://telynx.com/docs
- **Zod Validation**: https://zod.dev

---

Built for production. Ready to scale.
