# SMS Gateway Portal - Deployment Guide

This guide covers deploying the production-ready SMS Gateway Portal to Vercel (frontend) and Render/Heroku (backend).

## Architecture Overview

```
┌─────────────────────────┐
│   Frontend (Vercel)     │
│   Next.js + React       │
└────────────┬────────────┘
             │ API Calls
             ↓
┌─────────────────────────┐
│  Backend (Render/Heroku)│
│  Express + Twilio       │
└────────────┬────────────┘
             │ SMS API
             ↓
        Twilio API
```

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Twilio Account**: Sign up at https://www.twilio.com
3. **Vercel Account**: https://vercel.com
4. **Render or Heroku Account**: https://render.com or https://heroku.com

## Step 1: Prepare Twilio Credentials

1. Go to [Twilio Console](https://console.twilio.com)
2. Sign up or log in
3. Navigate to **Account > API keys & tokens**
4. Copy your **Account SID** and **Auth Token**
5. Get a Twilio phone number:
   - Go to **Phone Numbers > Manage > Buy a Number**
   - Select your country and desired area code
   - Complete purchase
6. Note the phone number in E.164 format (e.g., +1234567890)

## Step 2: Deploy Frontend to Vercel

### 2a. Connect GitHub to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Select "Continue with GitHub"
4. Authorize Vercel to access your repositories
5. Select your SMS Gateway repository

### 2b. Configure Environment Variables

1. In Vercel project settings, go to **Settings > Environment Variables**
2. Add the following variables:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
```

Replace `your-backend-domain.com` with your backend deployment URL (from Step 3).

### 2c. Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your Vercel deployment URL (e.g., `https://sms-gateway.vercel.app`)

## Step 3: Deploy Backend to Render

### 3a. Prepare Backend Code

The backend files are in the `/backend` directory:
- `backend/server.ts` - Express server
- `backend/routes/send-sms.ts` - SMS endpoint
- `backend/services/twilio-service.ts` - Twilio integration
- `backend/middleware/validation.ts` - Input validation

### 3b. Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" > "Web Service"
3. Select "Connect a GitHub repository"
4. Authorize and select your SMS Gateway repository
5. Configure the service:
   - **Name**: `sms-gateway-backend` (or similar)
   - **Environment**: Node
   - **Region**: Select closest to your users
   - **Branch**: main
   - **Build Command**: `npm install && npm run build:backend`
   - **Start Command**: `npm run start:backend`

### 3c. Add Environment Variables

In Render settings, go to **Environment** and add:

```
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-url.vercel.app
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

Replace:
- `your-frontend-url.vercel.app` with your Vercel deployment URL
- `your_account_sid` with your Twilio Account SID
- `your_auth_token` with your Twilio Auth Token
- `+1234567890` with your Twilio phone number

### 3d. Deploy

1. Click "Create Web Service"
2. Render will automatically deploy your backend
3. Wait for the build to complete
4. Copy your Render service URL (e.g., `https://sms-gateway-backend.onrender.com`)

## Step 4: Update Frontend with Backend URL

1. Go back to Vercel project settings
2. Update **NEXT_PUBLIC_API_BASE_URL** to your Render service URL
3. Vercel will automatically redeploy

## Step 5: Test the Deployment

1. Navigate to your Vercel frontend URL
2. In the Settings tab:
   - Update API Base URL to your Render backend URL
   - Verify Account Status shows as "Connected"
3. Test sending an SMS:
   - Enter a valid phone number in E.164 format
   - Enter sender ID (alphanumeric, max 11 chars)
   - Click "Send SMS"
   - Check the recipient phone for the message

## Troubleshooting

### API Connection Issues

**Problem**: "Network error. Check API URL and CORS configuration."

**Solution**:
1. Verify API URL is correct in Settings tab
2. Check CORS_ORIGIN in backend environment variables
3. Ensure CORS_ORIGIN matches your Vercel frontend URL exactly
4. Restart backend service

### SMS Sending Fails

**Problem**: "Invalid recipient number or sender ID"

**Solutions**:
1. Verify phone number is in E.164 format (+[country code][number])
2. Verify sender ID is alphanumeric, 1-11 characters
3. Check Twilio account has credits
4. Verify phone number isn't in Twilio's sandboxed testing mode

### Twilio Authentication Error

**Problem**: "Twilio authentication failed"

**Solutions**:
1. Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are correct
2. Check they haven't been regenerated in Twilio console
3. Update environment variables and redeploy backend

### Logs & Debugging

**Backend Logs** (Render):
1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. Check for errors

**Frontend Logs** (Vercel):
1. Go to Vercel project settings
2. Click "Deployments"
3. Select latest deployment
4. Check build and runtime logs

## Production Checklist

- [ ] Twilio account set up with verified phone number
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render/Heroku
- [ ] CORS_ORIGIN configured correctly
- [ ] All environment variables set
- [ ] Test SMS sending with real number
- [ ] Enable 2FA on Twilio account
- [ ] Monitor Twilio account usage/billing
- [ ] Set up logging/monitoring for backend
- [ ] Configure auto-redeploy on GitHub push

## Security Best Practices

1. **Never commit credentials**: Use `.env.local` for local development
2. **Rotate API keys**: Periodically regenerate Twilio tokens
3. **CORS restriction**: Always set specific CORS_ORIGIN, never use `*`
4. **Input validation**: Backend validates all inputs before sending SMS
5. **Error messages**: Production environment doesn't expose sensitive details
6. **HTTPS only**: All API calls use HTTPS in production
7. **Rate limiting**: Consider adding rate limiting to prevent abuse

## Scaling & Performance

- **Render**: Use "Optimize" plan for better performance
- **Vercel**: Auto-scales to handle traffic
- **Batch sends**: For high-volume SMS, consider using Twilio's batch API
- **Caching**: Frontend caches settings in localStorage

## Further Customization

### Change Sender Number Dynamically

Modify `backend/routes/send-sms.ts` to accept `from` parameter instead of using fixed number.

### Add Database for Message History

Replace localStorage with PostgreSQL:
1. Add Neon or Supabase database
2. Create messages table
3. Modify backend to store sent messages

### Add Authentication

1. Implement JWT or session-based auth
2. Protect `/api/send-sms` endpoint
3. Add login page to frontend

### Multi-language Support

1. Add i18n library (e.g., next-intl)
2. Add language selector to UI
3. Store user preference in localStorage

## Support

- **Twilio Docs**: https://www.twilio.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs

## License

This project is open source. Modify and deploy as needed.
