# 📍 Where to Add Environment Variables in Vercel

## Quick Answer

**Location:** Vercel Dashboard → Your Project → Settings → Environment Variables

---

## Detailed Step-by-Step

### Method 1: After Project is Created (Most Common)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in if needed

2. **Click on Your Project**
   - Find `speccon-firebase-app` in your projects list
   - Click on it

3. **Go to Settings**
   - Look at the top navigation bar
   - Click on **"Settings"** tab
   - (It's next to "Deployments", "Analytics", etc.)

4. **Click "Environment Variables"**
   - In the left sidebar menu, you'll see:
     - Overview
     - General
     - **Environment Variables** ← Click this!
     - Domains
     - Git
     - etc.

5. **Add Your Variables**
   - You'll see a button: **"Add New"** (top right)
   - Click it
   - Fill in the form:
     - **Key:** `REACT_APP_FIREBASE_API_KEY`
     - **Value:** (paste your Firebase API key)
     - **Environments:** Check ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**
   - Repeat for all 6 variables

---

### Method 2: During Project Import (Before First Deploy)

If you're importing the project for the first time:

1. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Project**
   - You'll see a configuration page
   - Scroll down to find **"Environment Variables"** section
   - Click to expand it
   - Click **"Add"** button
   - Add each variable before clicking "Deploy"

---

## Visual Guide

```
Vercel Dashboard
└── Your Project (speccon-firebase-app)
    └── Settings (top navigation)
        └── Environment Variables (left sidebar)
            └── "Add New" button
                └── Form:
                    - Key: REACT_APP_FIREBASE_API_KEY
                    - Value: [paste your value]
                    - Environments: ☑ Production ☑ Preview ☑ Development
                    - Save
```

---

## What It Looks Like

When you're in the right place, you'll see:

**Page Title:** "Environment Variables"

**Content:**
- A list of existing variables (if any)
- A button: **"Add New"** or **"Add"**
- A table showing:
  - Key (variable name)
  - Value (hidden/shown as dots)
  - Environments (Production/Preview/Development)
  - Actions (edit/delete)

---

## The 6 Variables You Need to Add

1. `REACT_APP_FIREBASE_API_KEY`
2. `REACT_APP_FIREBASE_AUTH_DOMAIN`
3. `REACT_APP_FIREBASE_PROJECT_ID`
4. `REACT_APP_FIREBASE_STORAGE_BUCKET`
5. `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
6. `REACT_APP_FIREBASE_APP_ID`

---

## Important Notes

✅ **Check all 3 environments** (Production, Preview, Development)  
✅ **Variable names must start with `REACT_APP_`** for React to see them  
✅ **Values are hidden** after saving (for security)  
✅ **Redeploy after adding variables** - changes only apply to new deployments  

---

## After Adding Variables

1. If you haven't deployed yet: Click **"Deploy"**
2. If project is already deployed: Go to **"Deployments"** → Click **"..."** → **"Redeploy"**

---

## Can't Find It?

**Check:**
- Are you signed in to Vercel? → https://vercel.com/login
- Do you have access to the project? → Check project settings
- Is the project imported? → Go to dashboard and check projects list

**Alternative:**
- Go directly to: `https://vercel.com/[your-username]/speccon-firebase-app/settings/environment-variables`
- (Replace `[your-username]` with your Vercel username)

---

## Quick Checklist

- [ ] Signed in to Vercel
- [ ] Project is imported/created
- [ ] Clicked on project name
- [ ] Clicked "Settings" tab
- [ ] Clicked "Environment Variables" in sidebar
- [ ] Clicked "Add New" button
- [ ] Added all 6 variables
- [ ] Checked all 3 environments for each
- [ ] Clicked "Save" for each
- [ ] Redeployed (if needed)

---

**That's it! You're in the right place when you see "Environment Variables" as the page title.** 🎯
