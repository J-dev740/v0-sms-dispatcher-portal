# SMS Gateway Portal

A production-ready SMS dispatcher with international support, alphanumeric branding, and smart message segmentation.

## Features

✅ **International SMS** - Send to any country using E.164 format  
✅ **Alphanumeric Sender ID** - Brand your messages (11 chars max)  
✅ **Smart Segmentation** - Automatic GSM-7/Unicode detection  
✅ **Device Preview** - See how messages appear on phones  
✅ **Session Logs** - Track all sent messages  
✅ **Mock Mode** - Test without SMS credits  
✅ **Real-time Validation** - E.164 phone format checking  
✅ **Production Ready** - CORS, input validation, error handling  

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express, Twilio SDK, zod validation
- **Deployment**: Vercel (frontend), Render/Heroku (backend)

## Quick Start

### 1. Local Development

#### Clone & Install
```bash
git clone <your-repo>
cd sms-gateway
npm install
```

#### Setup Environment
Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Create `backend/.env`:
```
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Run Frontend
```bash
npm run dev
# Frontend at http://localhost:3000
```

#### Run Backend (new terminal)
```bash
npm run dev:backend
# Backend at http://localhost:3001
```

#### Test with Mock Mode
1. Open http://localhost:3000
2. Go to Settings tab
3. Enable Mock Mode
4. Send a test SMS (no credits needed!)

### 2. Get Twilio Credentials

1. Sign up: https://www.twilio.com
2. Go to Account > API keys & tokens
3. Copy **Account SID** and **Auth Token**
4. Buy a number: Phone Numbers > Buy a Number
5. Add to your `.env`

### 3. Deploy

See [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md) for:
- Deploying frontend to Vercel
- Deploying backend to Render/Heroku
- Configuring CORS
- Setting up production environment variables

## Project Structure

```
├── app/
│   ├── page.tsx                 # Main dashboard
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Tailwind styles
├── components/sms-gateway/
│   ├── sms-composer.tsx         # Input form
│   ├── device-preview.tsx       # Phone mockup
│   ├── session-logs.tsx         # Message history
│   └── settings-panel.tsx       # Configuration
├── lib/
│   ├── sms-utils.ts             # GSM/Unicode detection, validation
│   └── api-client.ts            # API wrapper
├── backend/
│   ├── server.ts                # Express app
│   ├── routes/send-sms.ts       # SMS endpoint
│   ├── services/twilio-service.ts
│   └── middleware/validation.ts # Input validation
├── DEPLOY_INSTRUCTIONS.md       # Production deployment guide
└── .env.example                 # Environment template
```

## API Documentation

### POST /api/send-sms

Send an SMS via Twilio.

**Request**:
```json
{
  "to": "+1234567890",      // E.164 format
  "from": "COMPANY",         // Alphanumeric, max 11 chars
  "message": "Hello world"   // 1-4000 chars
}
```

**Response (Success)**:
```json
{
  "success": true,
  "sid": "SM1234567890abcdef"  // Twilio message SID
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Invalid phone number format",
  "code": "VALIDATION_ERROR"
}
```

## Usage Examples

### Send a Simple Message

```typescript
const response = await fetch('http://localhost:3001/api/send-sms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+1234567890',
    from: 'ACME',
    message: 'Your confirmation code is: 123456'
  })
});
```

### International Numbers

```
US:      +1 (country code 1)
UK:      +44
India:   +91
Japan:   +81
Brazil:  +55
```

### Message Segmentation

- **GSM-7**: 160 chars/segment, 153 for multi-part
- **Unicode**: 70 chars/segment, 67 for multi-part
- Auto-detected based on message content

## Configuration

### Frontend Settings
- **Mock Mode**: Toggle to test without sending
- **API Base URL**: Point to your backend deployment
- **Account Status**: Shows Twilio connection status

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `production` |
| `CORS_ORIGIN` | Frontend URL | `https://app.vercel.app` |
| `TWILIO_ACCOUNT_SID` | Twilio auth | From Twilio console |
| `TWILIO_AUTH_TOKEN` | Twilio auth | From Twilio console |
| `TWILIO_PHONE_NUMBER` | Sender number | `+1234567890` |

## Security

- ✅ API keys stored in backend environment only
- ✅ Input validation on both frontend and backend
- ✅ CORS restricted to specified domain
- ✅ E.164 phone number format validation
- ✅ Alphanumeric sender ID validation
- ✅ No sensitive data in error messages (production)
- ✅ 1KB request size limit
- ✅ HTTPS required in production

## Testing

### Mock Mode Testing
```bash
# Enable Mock Mode in Settings
# Send test SMS without credits
# View in Session Logs with "Mock" badge
```

### Real SMS Testing
```bash
# With Twilio trial account
# Verify your phone number
# Use test credits for development
# Monitor usage in Twilio dashboard
```

### Validation Testing
```bash
# Test invalid phone: "not-a-number"
# Test short number: "+1"
# Test long sender ID: "ABCDEFGHIJKLMNOP"
```

## Performance Optimization

- **Frontend**: localStorage caches settings and logs
- **Backend**: Input validation before Twilio API call
- **Twilio**: Connection pooling via SDK
- **Deployment**: CDN via Vercel/Render

## Troubleshooting

### "Network error. Check API URL and CORS configuration"
- Verify API URL in Settings tab
- Check backend `CORS_ORIGIN` matches frontend URL
- Ensure backend is running/deployed

### "Invalid phone number format"
- Use E.164 format: +[country code][number]
- Example: +1234567890 (not 1234567890)

### "Twilio authentication failed"
- Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
- Check they haven't been regenerated in Twilio console
- Restart backend service

### Sessions Logs disappear on refresh
- Logs are stored in browser localStorage
- Clearing browser data removes logs
- For persistent storage, add a database (see DEPLOY_INSTRUCTIONS.md)

## Scaling

### For High Volume
1. Implement message queues (Bull, RabbitMQ)
2. Add rate limiting to prevent abuse
3. Use Twilio's batch SMS API
4. Deploy backend across multiple instances

### Add Database
1. Use Supabase or Neon PostgreSQL
2. Store sent messages permanently
3. Track delivery status
4. Audit trail for compliance

## Customization

### Change Default Sender Number
Modify `backend/routes/send-sms.ts` to accept dynamic sender from request.

### Add User Authentication
1. Implement login with Supabase or Auth.js
2. Protect `/api/send-sms` endpoint
3. Store user-specific settings

### Multi-language UI
1. Add next-intl library
2. Wrap components with language provider
3. Add language selector to header

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Open source. Modify and deploy as needed.

## Support

- **Twilio Docs**: https://www.twilio.com/docs
- **Next.js**: https://nextjs.org/docs
- **Express**: https://expressjs.com
- **Issues**: Open an issue on GitHub

---

Built with ❤️ for developers who need reliable SMS infrastructure.
