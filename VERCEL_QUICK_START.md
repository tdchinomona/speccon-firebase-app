# ⚡ Vercel Quick Start - 5 Minute Guide

## Fastest Way to Deploy

### Step 1: Push to GitHub (2 min)
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/speccon-firebase-app.git
git push -u origin main
```

### Step 2: Deploy on Vercel (3 min)

1. **Go to:** https://vercel.com
2. **Click:** "Add New..." → "Project"
3. **Import** your GitHub repository
4. **Add Environment Variables** (6 variables from Firebase config):
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
5. **Click:** "Deploy"
6. **Wait 2-3 minutes**
7. **Done!** Your app is live at `https://your-project.vercel.app`

---

## Where to Find Firebase Config

1. Firebase Console → Project Settings
2. Scroll to "Your apps" → Web app
3. Copy values from `firebaseConfig` object

---

## Full Guide

For detailed instructions, see **VERCEL_DEPLOYMENT.md**

---

## Troubleshooting

**Build fails?** → Check all 6 environment variables are set  
**Blank page?** → Check browser console (F12) for errors  
**Can't login?** → Verify user exists in Firebase Authentication

---

**That's it! 🚀**
