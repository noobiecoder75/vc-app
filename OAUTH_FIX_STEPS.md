# 🚨 URGENT: Fix Google OAuth Button

## The Problem
Your Netlify site `https://bucolic-otter-bae11c.netlify.app` doesn't have the proper Supabase configuration.

## ⚡ IMMEDIATE FIXES (Do These Now)

### Step 1: Add Environment Variables to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Find your site "bucolic-otter-bae11c" 
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** and add these:

```
VITE_SUPABASE_URL = https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY = your_anon_key_here
```

**⚠️ CRITICAL:** Without these variables, nothing will work!

### Step 2: Update Supabase Site URL
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **General** 
4. Change **Site URL** from `http://localhost:3000` to:
   ```
   https://bucolic-otter-bae11c.netlify.app
   ```
5. Click **Save**

### Step 3: Configure Google OAuth (If Not Done)
1. In Supabase: **Authentication** → **Providers**
2. Click **Google** → **Enable Google provider**
3. You need Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase

### Step 4: Force Redeploy
After adding environment variables:
1. In Netlify: **Deploys** tab
2. Click **Deploy site** (manually trigger new deploy)

## 🧪 Test After Each Step
Visit: https://bucolic-otter-bae11c.netlify.app/auth

## 🔍 Quick Debug
Open browser console (F12) and check for errors. You should see:
- No "VITE_SUPABASE_URL is undefined" errors
- No CORS errors
- Google button should be clickable

## 📞 If Still Broken
Check browser console and tell me the exact error message!