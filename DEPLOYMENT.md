# SMS Gateway Portal - Deployment Guide

Deploy your SMS Gateway Portal to Vercel in minutes.

## Prerequisites

1. GitHub account with your project repository
2. Vercel account (free)
3. Telynx account and API key

## Step 1: Get Telynx API Key

1. Go to [telynx.com](https://telynx.com)
2. Sign up for free account
3. Verify your email
4. Go to API settings in dashboard
5. Create new API key
6. Copy the key (you'll need it in Step 3)

## Step 2: Deploy to Vercel

### Option A: Deploy from GitHub (Recommended)

1. Push your code to GitHub
   ```bash
   git add .
   git commit -m "SMS Gateway Portal"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)

3. Click "Add New" → "Project"

4. Import your GitHub repository
   - Select your account
   - Search for your repository
   - Click "Import"

5. Configure project
   - Framework: Next.js (auto-detected)
   - Root Directory: ./ (auto-detected)
   - Click "Deploy"

6. Wait for deployment to complete (1-2 minutes)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy
vercel

# Follow prompts to select project and settings
```

## Step 3: Add Telynx API Key

1. Go to your Vercel project dashboard
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add new variable:
   - **Name**: `TELYNX_API_KEY`
   - **Value**: Your Telynx API key from Step 1
   - Select "Production" environment
   - Click "Add"

5. Redeploy to apply changes
   - Click "Deployments" tab
   - Click the latest deployment's three dots
   - Click "Redeploy"

## Step 4: Verify Deployment

1. Open your Vercel deployment URL (shown after deploy)
2. Test with Mock Mode first
   - Go to Settings tab
   - Enable "Mock Mode"
   - Send test message
3. Disable Mock Mode
   - Send real SMS with Telynx API key
   - Check Telynx dashboard for delivery status

## Configuration

### Environment Variables (Vercel)

Only one variable needed for production:

| Variable | Value | Where |
|----------|-------|-------|
| `TELYNX_API_KEY` | Your Telynx API key | Vercel Environment Variables |

### Frontend Settings (In App)

Once deployed, you can configure:
- **Mock Mode**: Toggle to test without SMS credits
- **Message Preview**: See how SMS appears on devices

## Troubleshooting

### "SMS service not configured"
**Problem**: Messages won't send even with Mock Mode disabled

**Solution**:
1. Check TELYNX_API_KEY is in Vercel environment variables
2. Verify key is correct (copy/paste from Telynx dashboard)
3. Redeploy the project
4. Wait 1-2 minutes for deployment to complete

### "Invalid phone number format"
**Problem**: E.164 validation error

**Solution**:
- Use format: `+[country code][number]`
- Example: `+12125551234` (not `212-555-1234`)

### "Network error"
**Problem**: Can't reach SMS service

**Solution**:
1. Check browser console (F12) for error details
2. Verify Telynx API key in Vercel env vars
3. Check Vercel function logs:
   - Go to Deployments tab
   - Click latest deployment
   - Click "Function Logs"

## Local Development (Without Telynx)

Run locally with Mock Mode only:

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Open http://localhost:3000
# Enable Mock Mode in Settings
# Send test messages
```

## Scaling

For high-volume SMS:

1. Check Telynx pricing and limits
2. Monitor usage in Telynx dashboard
3. Add message queues for reliability (Future enhancement)
4. Implement rate limiting (Future enhancement)

## Support

- **Telynx Docs**: https://telynx.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Security Checklist

- ✅ TELYNX_API_KEY only in Vercel, never in Git
- ✅ No sensitive data in client-side code
- ✅ Input validation on server-side
- ✅ HTTPS enforced by Vercel
- ✅ Environment variables marked "Production" only

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add TELYNX_API_KEY environment variable
3. ✅ Test with Mock Mode
4. ✅ Send real SMS with Telynx
5. ✅ Monitor usage in Telynx dashboard
6. Consider: Add database for message persistence
7. Consider: Add user authentication
8. Consider: Implement rate limiting
