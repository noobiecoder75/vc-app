# 🔍 Debug Google OAuth Button (Step by Step)

## Issue: Button was working before, now it's not

Since your environment variables are set, let's find the exact problem:

## Step 1: Check Supabase Site URL (Most Common Issue)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **General**
4. Check what your **Site URL** is currently set to

**It MUST be exactly:** `https://bucolic-otter-bae11c.netlify.app`

❌ **Common wrong values:**
- `http://localhost:3000`
- `https://localhost:3000` 
- `https://bucolic-otter-bae11c.netlify.app/` (with trailing slash)
- An old Netlify URL

## Step 2: Check Google Provider Status

1. In Supabase: **Authentication** → **Providers**
2. Check if **Google** is:
   - ✅ Enabled (toggle should be ON)
   - ✅ Has Client ID and Client Secret filled in
   - ✅ Has the correct redirect URI

## Step 3: Verify Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Find your OAuth 2.0 Client ID
3. Check **Authorized redirect URIs** includes:
   ```
   https://zioanurjqolbtdstqjfc.supabase.co/auth/v1/callback
   ```
   (Replace with your actual Supabase project URL)

## Step 4: Test in Browser Console

1. Visit: https://bucolic-otter-bae11c.netlify.app/auth
2. Open Developer Tools (F12) → Console
3. Run this command:
   ```javascript
   console.log('Site URL:', window.location.origin);
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   ```
4. Check for any red error messages

## Step 5: Clear Browser Cache

Sometimes OAuth gets stuck in browser cache:
1. Hard refresh the page: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Or open in Incognito/Private browsing mode

## What to Check Now

**Tell me exactly what you see for these:**

1. What is your current Supabase Site URL?
2. Is Google provider enabled in Supabase?
3. Any errors in browser console when you click the Google button?
4. Does the button do absolutely nothing, or does it show an error?

## Quick Test

Try this right now:
1. Go to https://bucolic-otter-bae11c.netlify.app/auth
2. Right-click → Inspect Element
3. Click Console tab
4. Click the Google button
5. Copy any error messages you see

**The error message will tell us exactly what's wrong!** 🎯