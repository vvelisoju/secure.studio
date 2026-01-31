# Deployment Guide

## Architecture

- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway (Node.js + Express + PostgreSQL)
- **Database**: Railway PostgreSQL

## URLs

- **Frontend (Production)**: `https://your-app.vercel.app`
- **Backend (Production)**: `https://securestudio-production.up.railway.app`
- **Frontend (Development)**: `http://localhost:5000`
- **Backend (Development)**: `http://localhost:4000`

---

## Frontend Deployment (Vercel)

### 1. Environment Variables

Configure in **Vercel Dashboard → Settings → Environment Variables**:

```bash
VITE_API_BASE_URL=https://securestudio-production.up.railway.app
```

### 2. Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

### 3. Deploy

```bash
cd app
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

Vercel will auto-deploy on push to main branch.

---

## Backend Deployment (Railway)

### 1. Environment Variables

Configure in **Railway Dashboard → Variables**:

#### Required Variables

```bash
# Database (Auto-configured by Railway PostgreSQL plugin)
DATABASE_URL=postgresql://...

# Server
PORT=5000
NODE_ENV=production
SERVER_BASE_URL=https://securestudio-production.up.railway.app
CLIENT_URL=https://your-vercel-app.vercel.app

# Application
APP_NAME=Secure Studio
ENVIRONMENT=prod
```

#### Optional Variables (Configure as needed)

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Mailgun)
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
MAILGUN_FROM=noreply@yourdomain.com

# AWS S3
S3Storage=true
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

### 2. Build Settings

Railway auto-detects Node.js. Ensure `package.json` has:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 3. Database Setup

After deploying:

```bash
# Run migrations
npx prisma db push

# Seed database
npx prisma db seed
```

Run these commands in Railway's terminal or locally with production `DATABASE_URL`.

---

## Post-Deployment Checklist

### Frontend (Vercel)

- [ ] Environment variable `VITE_API_BASE_URL` is set
- [ ] Build completes successfully
- [ ] App loads at root URL (`/`)
- [ ] Routing works (e.g., `/auth`, `/dashboard`)
- [ ] API calls connect to Railway backend

### Backend (Railway)

- [ ] All required environment variables are set
- [ ] Database connection works
- [ ] Prisma migrations applied
- [ ] Database seeded with initial data
- [ ] API endpoints respond correctly
- [ ] CORS allows Vercel frontend domain

### Integration

- [ ] Frontend can call backend API
- [ ] Authentication flow works (OTP/Google OAuth)
- [ ] No CORS errors in browser console
- [ ] Google OAuth redirect URIs updated in Google Cloud Console

---

## Troubleshooting

### 404 Error on Frontend Routes

**Problem**: Accessing `/auth` directly shows 404

**Solution**: Ensure `app/vercel.json` exists with SPA routing config:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### CORS Errors

**Problem**: Frontend can't call backend API

**Solution**: 
1. Verify `CLIENT_URL` in Railway matches your Vercel URL
2. Check `server.ts` has CORS configured:
   ```typescript
   app.use(cors({ origin: process.env.CLIENT_URL }));
   ```

### Google OAuth Redirect Mismatch

**Problem**: Google OAuth fails with redirect URI error

**Solution**: Update Google Cloud Console → Credentials → Authorized redirect URIs:
```
https://securestudio-production.up.railway.app/api/auth/google/callback
```

### Database Connection Failed

**Problem**: Railway backend can't connect to database

**Solution**: 
1. Ensure Railway PostgreSQL plugin is added
2. Verify `DATABASE_URL` is set in Railway variables
3. Check database is running in Railway dashboard

---

## Local Development

### Frontend

```bash
cd app
npm install
npm run dev
# Runs on http://localhost:5000
```

### Backend

```bash
cd api
npm install
npm run dev
# Runs on http://localhost:4000
```

### Environment Files

- Frontend: Use `.env.development`
- Backend: Use `.env` (local)

---

## Updating Production

### Frontend Changes

```bash
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys
```

### Backend Changes

```bash
git add .
git commit -m "Update backend"
git push
# Railway auto-deploys
```

### Database Schema Changes

```bash
# Update schema.prisma
npx prisma db push
# Or create migration
npx prisma migrate dev --name your_migration_name
npx prisma migrate deploy
```

---

## Monitoring

- **Vercel**: Dashboard → Analytics & Logs
- **Railway**: Dashboard → Deployments → Logs
- **Database**: Railway → PostgreSQL → Metrics

---

## Security Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Rotate secrets regularly** (API keys, database passwords)
3. **Use HTTPS only** in production
4. **Enable Vercel password protection** for staging environments
5. **Monitor Railway usage** to avoid unexpected costs
