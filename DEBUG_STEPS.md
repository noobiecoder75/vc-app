# 🔍 Authentication Debugging Guide

## Step 1: Check What's Not Working

Visit your deployed site: https://bucolic-otter-bae11c.netlify.app

**Test these scenarios:**
1. Does the homepage load?
2. Can you navigate to `/auth`?
3. Does the Google button show up?
4. What happens when you click the Google button?
5. Can you sign up with email/password?

## Step 2: Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Visit `/auth` page
4. Look for any red errors
5. Try clicking the Google button
6. Copy any error messages you see

## Step 3: Check Environment Variables

Your deployed site needs these environment variables:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**To check in Netlify:**
1. Go to Netlify dashboard
2. Find your site "bucolic-otter-bae11c"
3. Go to Site settings → Environment variables
4. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set

## Step 4: Check Supabase Configuration

**Site URL Configuration:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → General
4. Check if "Site URL" is set to: `https://bucolic-otter-bae11c.netlify.app`

**OAuth Configuration:**
1. Go to Authentication → Providers
2. Check if Google provider is enabled
3. Verify redirect URLs include your Netlify domain

## Step 5: Most Common Issues

### Issue #1: Missing Environment Variables
**Fix:** Add them in Netlify Site Settings → Environment variables

### Issue #2: Wrong Site URL
**Fix:** Update Supabase Site URL to match your Netlify URL

### Issue #3: Google OAuth Not Configured
**Fix:** Enable Google provider in Supabase and configure OAuth app

### Issue #4: CORS Issues
**Fix:** Add your Netlify URL to Supabase allowed origins

## Quick Test Commands

Run these in your browser console on the auth page:

```javascript
// Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING');

// Test Supabase connection
import { supabase } from './src/lib/supabaseClient';
supabase.auth.getSession().then(console.log);
```

## Tell Me What You Find

Please check these and let me know:
1. What error messages do you see in the console?
2. Are environment variables set in Netlify?
3. What's the current Site URL in Supabase?
4. Is Google OAuth enabled in Supabase?

With this info, I can give you the exact fix! 🎯