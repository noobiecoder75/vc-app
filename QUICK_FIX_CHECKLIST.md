# ⚡ Quick Fix Checklist

## If Google Button Doesn't Work:

### 1. Update Supabase Site URL
- Go to Supabase Dashboard → Settings → General
- Set Site URL to: `https://bucolic-otter-bae11c.netlify.app`
- Click Save

### 2. Add Environment Variables to Netlify
- Go to Netlify Dashboard → Site Settings → Environment Variables
- Add: `VITE_SUPABASE_URL=https://your-project.supabase.co`
- Add: `VITE_SUPABASE_ANON_KEY=your-anon-key`
- Redeploy site after adding variables

### 3. Enable Google OAuth in Supabase
- Go to Supabase → Authentication → Providers
- Enable Google provider
- Add callback URL: `https://your-project.supabase.co/auth/v1/callback`

### 4. Force Redeploy
Sometimes Netlify needs a fresh deployment:
- In Netlify dashboard, click "Deploys"
- Click "Deploy site" → "Deploy site"

## Test After Each Fix
Visit: https://bucolic-otter-bae11c.netlify.app/auth
Try the Google button again.

## Still Not Working?
Share the browser console errors with me and I'll give you the exact solution! 🚀