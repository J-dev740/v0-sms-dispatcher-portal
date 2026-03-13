# SMS Gateway Portal - Setup Guide

Complete guide to set up and run the SMS Gateway Portal locally or in production.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Getting Twilio Credentials](#getting-twilio-credentials)
3. [Running Locally](#running-locally)
4. [Testing](#testing)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

- **Node.js**: 18+ (check with `node --version`)
- **npm/pnpm**: Latest version
- **Git**: For cloning the repository

### Step 1: Clone Repository

```bash
git clone <your-repository-url>
cd sms-gateway
```

### Step 2: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 3: Setup Environment Files

#### Frontend Environment (`.env.local`)

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

#### Backend Environment (`backend/.env`)

Create `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Getting Twilio Credentials

### Option 1: Free Trial Account

1. Go to [Twilio.com](https://www.twilio.com)
2. Click "Sign Up"
3. Complete the verification process
4. Get $15 free trial credit

### Option 2: Full Account

1. Sign up with your phone number
2. Verify via SMS or call
3. Create a project
4. Link a payment method

### Getting Your Credentials

1. Log in to [Twilio Console](https://console.twilio.com)
2. Look for "Account SID" and "Auth Token" on the dashboard
3. Copy both values (keep Auth Token secret!)

### Getting a Twilio Phone Number

1. In Twilio Console, go to **Phone Numbers**
2. Click **Manage > Buy a Number**
3. Select your country
4. Choose an area code
5. Click **Buy** and confirm
6. You'll get a number like: **+1 (555) 123-4567**

### Convert Phone Number to E.164 Format

E.164 format removes all formatting:
- `+1 (555) 123-4567` → `+15551234567`
- `+44 20 XXXX XXXX` → `+442XXXXXXXX`

Add this to your `backend/.env`:
```
TWILIO_PHONE_NUMBER=+15551234567
```

## Running Locally

### Terminal 1: Start Frontend

```bash
npm run dev
```

Output:
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
```

### Terminal 2: Start Backend

```bash
npm run dev:backend
```

Output:
```
✓ SMS Gateway server running on port 3001
✓ CORS enabled for: http://localhost:3000
✓ Environment: development
```

### Access the App

Open http://localhost:3000 in your browser.

## Testing

### Test 1: Mock Mode (No Twilio Account Needed)

1. Open http://localhost:3000
2. Go to **Settings** tab
3. Enable **Mock Mode**
4. Fill in a test number: `+1234567890`
5. Enter sender ID: `TEST`
6. Type a message: `Hello World`
7. Click **Send SMS**
8. Check **Session Logs** - message should appear with "Mock" badge

### Test 2: Real SMS (Requires Twilio Account)

1. Complete the Twilio setup above
2. Disable **Mock Mode** in Settings
3. Update **API Base URL** if needed (should be http://localhost:3001)
4. Verify phone numbers in Twilio (for trial accounts)
5. Send SMS to verified number
6. Check your phone for the message

### Test 3: Validation Testing

Test error handling:

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Invalid phone | "123" | Error: "Invalid phone number format" |
| Missing sender | "" | Error: "Sender ID is required" |
| Long sender | "ABCDEFGHIJKLMNOP" | Error: "max 11 characters" |
| Empty message | "" | Error: "Message is required" |
| Unicode message | "Hello 😊" | Shows as Unicode/UCS-2 encoding |

## Production Deployment

### Option 1: Deploy to Vercel + Render

See [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md) for step-by-step guide:
- Frontend → Vercel
- Backend → Render or Heroku
- Configure environment variables
- Update CORS settings

### Option 2: Self-Hosted

1. **Frontend** (Next.js):
   ```bash
   npm run build
   npm run start
   ```

2. **Backend** (Express):
   ```bash
   npm run build:backend
   npm run start:backend
   ```

3. Use reverse proxy (Nginx) to route:
   - `/` → Frontend (Next.js)
   - `/api/*` → Backend (Express)

### Environment Variables for Production

**Frontend** (Vercel):
- `NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com`

**Backend** (Render/Heroku):
- `NODE_ENV=production`
- `CORS_ORIGIN=https://your-frontend-domain.com`
- `TWILIO_ACCOUNT_SID=your_production_sid`
- `TWILIO_AUTH_TOKEN=your_production_token`
- `TWILIO_PHONE_NUMBER=+1234567890`

## Project Structure

```
sms-gateway/
├── app/
│   ├── page.tsx                 # Main dashboard
│   ├── layout.tsx               # Root layout with metadata
│   ├── globals.css              # Tailwind styles
│   └── api/
│       └── send-sms/
│           └── route.ts         # Next.js API proxy
├── components/sms-gateway/
│   ├── sms-composer.tsx         # SMS form component
│   ├── device-preview.tsx       # Phone mockup preview
│   ├── session-logs.tsx         # Message history
│   └── settings-panel.tsx       # Settings UI
├── lib/
│   ├── sms-utils.ts             # SMS validation & segmentation
│   └── api-client.ts            # API client utility
├── backend/
│   ├── server.ts                # Express app
│   ├── routes/send-sms.ts       # SMS endpoint handler
│   ├── services/twilio-service.ts
│   ├── middleware/validation.ts
│   └── .env.example
├── README.md                    # Project overview
├── SETUP_GUIDE.md              # This file
├── DEPLOY_INSTRUCTIONS.md      # Production deployment
├── .env.example                 # Frontend env template
├── package.json
└── tsconfig.json
```

## Key Files Explained

### `lib/sms-utils.ts`
- `validateE164()`: Checks phone number format
- `validateSenderId()`: Checks sender ID (A-Z0-9, max 11 chars)
- `calculateSegments()`: Counts SMS segments needed
- `detectEncoding()`: Detects GSM-7 vs Unicode

### `backend/services/twilio-service.ts`
- Initializes Twilio client from env variables
- `sendSMS()`: Sends SMS via Twilio API
- Error handling for common failures

### `components/sms-gateway/sms-composer.tsx`
- Form with phone, sender ID, message fields
- Real-time validation feedback
- Displays character count and segments

## Common Issues

### Issue: "Network error. Check API URL and CORS configuration"

**Solutions**:
1. Verify backend is running: `npm run dev:backend`
2. Check API URL in Settings: `http://localhost:3001`
3. Verify CORS_ORIGIN in `backend/.env` is `http://localhost:3000`
4. Check browser console for exact error

### Issue: "Twilio authentication failed"

**Solutions**:
1. Verify TWILIO_ACCOUNT_SID is not empty
2. Verify TWILIO_AUTH_TOKEN is not empty
3. Check values from https://console.twilio.com
4. They may have been regenerated - get fresh values

### Issue: "Invalid recipient number"

**Solutions**:
1. Use E.164 format: `+[country code][number]`
2. Include the `+` symbol
3. No spaces or hyphens
4. Examples:
   - US: `+1234567890`
   - UK: `+441234567890`
   - India: `+911234567890`

### Issue: SMS not received in trial mode

**Solutions**:
1. Verify phone number in Twilio console
2. For trial accounts, you must add verified numbers
3. Use "Test Credentials" mode (Mock Mode) for development
4. Check Twilio logs in console for delivery status

## Next Steps

1. **Test locally** with Mock Mode
2. **Set up Twilio account** and get real credentials
3. **Test real SMS** sending
4. **Deploy to production** using DEPLOY_INSTRUCTIONS.md
5. **Monitor usage** in Twilio dashboard
6. **Add features** like:
   - User authentication
   - Database for message history
   - Multi-language UI
   - Rate limiting
   - Webhook for delivery confirmations

## Security Reminders

- Never commit `.env` files with real credentials
- Keep `TWILIO_AUTH_TOKEN` secret
- Use different credentials for development and production
- In production, rotate Twilio tokens periodically
- Set specific CORS_ORIGIN, never use `*`
- Enable 2FA on your Twilio account

## Getting Help

1. **Check logs**:
   - Backend: `npm run dev:backend` output
   - Frontend: Browser console (F12)

2. **Verify setup**:
   - `backend/.env` has all required variables
   - `.env.local` has correct API URL
   - Twilio credentials are valid

3. **Test endpoints**:
   - Frontend: http://localhost:3000
   - Backend health: http://localhost:3001/health
   - API endpoint: POST http://localhost:3001/api/send-sms

4. **Documentation**:
   - [Twilio SMS API](https://www.twilio.com/docs/sms)
   - [Next.js Docs](https://nextjs.org/docs)
   - [Express Docs](https://expressjs.com)

## Support

- Questions? Open an issue on GitHub
- Bug reports? Include error logs and steps to reproduce
- Feature requests? Describe the use case and expected behavior

---

Ready to start? Jump to [Running Locally](#running-locally)!
