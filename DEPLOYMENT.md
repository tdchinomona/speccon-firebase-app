# 🚀 Deployment Guide - SpecCon Firebase App

## Quick Deployment Steps

### Option 1: Firebase Hosting (Recommended for Firebase projects)

#### Step 1: Login to Firebase
Open your terminal and run:
```bash
firebase login
```
This will open a browser window. Sign in with your Google account and authorize Firebase CLI.

#### Step 2: Initialize Firebase Project (if not already done)
```bash
firebase init hosting
```

When prompted:
- **Select existing project** (choose your Firebase project)
- **Public directory:** `build`
- **Single-page app:** `Yes`
- **Automatic builds:** `No`

#### Step 3: Deploy
```bash
npm run build
firebase deploy --only hosting
```

Your app will be live at: `https://YOUR-PROJECT-ID.web.app`

#### Step 4: Configure Environment Variables
Since Firebase Hosting serves static files, you need to set environment variables at build time:

1. Create `.env.production` file with your Firebase config:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

2. Build with production environment:
```bash
npm run build
firebase deploy --only hosting
```

---

### Option 2: Vercel (Easier, Better for CI/CD) ⭐ RECOMMENDED

**For detailed step-by-step instructions, see: `VERCEL_DEPLOYMENT.md`**

**Quick Start:**
1. Push code to GitHub (see VERCEL_DEPLOYMENT.md for details)
2. Go to https://vercel.com and sign in with GitHub
3. Import your GitHub repository
4. Add 6 environment variables from your Firebase config
5. Click "Deploy"
6. Done! Your app is live in 2-3 minutes

**Advantages:**
- ✅ No CLI login required
- ✅ Automatic deployments on every git push
- ✅ Preview deployments for pull requests
- ✅ Free tier is generous
- ✅ Built-in CI/CD

**See `VERCEL_QUICK_START.md` for a 5-minute guide, or `VERCEL_DEPLOYMENT.md` for complete instructions.**

---

### Option 3: Netlify

1. Go to https://netlify.com
2. Sign in with GitHub
3. Drag and drop your `build` folder, OR
4. Connect GitHub repository
5. Build command: `npm run build`
6. Publish directory: `build`
7. Add environment variables in Site settings
8. Deploy!

---

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Login page displays correctly
- [ ] Can login with admin credentials
- [ ] Dashboard displays data
- [ ] Firebase authentication works
- [ ] Firestore security rules are deployed
- [ ] Environment variables are set correctly
- [ ] HTTPS is enabled (automatic on Vercel/Netlify/Firebase)

---

## Troubleshooting

### "Firebase not configured" error
- Make sure all environment variables are set in your hosting platform
- Rebuild the app after setting environment variables

### "Permission denied" error
- Deploy Firestore rules: `firebase deploy --only firestore:rules`
- Check Firestore security rules in Firebase Console

### Build fails
- Check Node.js version (should be 18+)
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript/ESLint errors

---

## Custom Domain (Optional)

### Firebase Hosting
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration instructions

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

---

## Continuous Deployment

### Vercel/Netlify
- Automatic deployments on every git push
- Preview deployments for pull requests

### Firebase Hosting
- Use GitHub Actions or similar CI/CD
- Or manually deploy: `firebase deploy --only hosting`

---

## Need Help?

- Firebase Docs: https://firebase.google.com/docs/hosting
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
