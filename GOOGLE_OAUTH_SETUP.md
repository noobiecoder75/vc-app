# 🔧 Google OAuth Setup for Netlify Deployment

## The Issue
Your Google OAuth button isn't working because it needs to be configured for your deployed Netlify URL: `https://bucolic-otter-bae11c.netlify.app`

## 🚀 Quick Fix Steps

### 1. Update Supabase Site URL
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **General**
4. Update **Site URL** to: `https://bucolic-otter-bae11c.netlify.app`
5. Click **Save**

### 2. Configure Google OAuth Provider
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Configure**
3. Enable Google provider
4. You'll need to create a Google OAuth app:

#### Create Google OAuth App:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set application type to **Web application**
6. Add these **Authorized redirect URIs**:
   ```
   https://zioanurjqolbtdstqjfc.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**

#### Configure in Supabase:
1. Back in Supabase **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

### 3. Update Redirect URLs (if needed)
1. In Supabase **Authentication** → **URL Configuration**
2. Add your Netlify URL to **Redirect URLs**:
   ```
   https://bucolic-otter-bae11c.netlify.app/**
   ```

## 🧪 Test the Fix
1. Visit your deployed site: https://bucolic-otter-bae11c.netlify.app/auth
2. Click the "Continue with Google" button
3. Complete the Google OAuth flow
4. You should be redirected back to your app

## 🔍 Troubleshooting

### If button still doesn't work:
1. **Check browser console** for errors (F12 → Console)
2. **Verify Site URL** matches exactly in Supabase settings
3. **Check OAuth redirect URI** in Google Console matches Supabase callback URL
4. **Clear browser cache** and try again

### Common Error Messages:
- **"OAuth provider not found"**: Google provider not enabled in Supabase
- **"Invalid redirect URI"**: Google OAuth app needs the Supabase callback URL
- **"Site URL mismatch"**: Supabase Site URL needs to match your Netlify URL

## ✅ Verification Checklist
- [ ] Supabase Site URL updated to Netlify URL
- [ ] Google OAuth app created in Google Cloud Console
- [ ] Supabase callback URL added to Google OAuth app
- [ ] Google provider enabled and configured in Supabase
- [ ] Redirect URLs configured in Supabase
- [ ] Tested on deployed site

Once configured, your Google OAuth will work perfectly! 🎉