# 📋 Step 1: Get User UID from Firebase Authentication - Detailed Guide

## Overview

Before you can create the user profile in Firestore, you need to get the User ID (UID) from Firebase Authentication. This UID is a unique identifier that links the Authentication user to the Firestore profile.

---

## Detailed Step-by-Step Instructions

### Part A: Access Firebase Console

1. **Open your web browser**
   - Use Chrome, Firefox, Edge, or Safari
   - Make sure you're signed in to your Google account

2. **Go to Firebase Console**
   - Type in address bar: `https://console.firebase.google.com`
   - Or click this link: [Firebase Console](https://console.firebase.google.com)

3. **Sign in (if needed)**
   - If you see a sign-in page, click **"Sign in"**
   - Use the Google account that created your Firebase project
   - Complete any 2FA if prompted

4. **Select your project**
   - You'll see a list of Firebase projects
   - Click on your project name (e.g., `speccon-cash-reports` or similar)
   - If you only have one project, it may open automatically

✅ **You should now see your Firebase project dashboard**

---

### Part B: Navigate to Authentication

1. **Look at the left sidebar**
   - You'll see a menu with options like:
     - Project Overview
     - Build
     - Release
     - Analytics
     - etc.

2. **Find "Build" section**
   - Look for **"Build"** in the left sidebar
   - It might be collapsed (click to expand if needed)

3. **Click "Authentication"**
   - Under "Build", you'll see:
     - Authentication
     - Firestore Database
     - Storage
     - Functions
     - etc.
   - Click on **"Authentication"**

✅ **You should now see the Authentication page**

---

### Part C: Check if User Already Exists

1. **Look at the top tabs**
   - You'll see tabs like:
     - **Users** ← Click this!
     - Sign-in method
     - Templates
     - Usage

2. **Click "Users" tab**
   - This shows all users in your Authentication system

3. **Check the list**
   - Look for `admin@speccon.com` in the email column
   - If you see it, **skip to Part E** (Get the UID)
   - If you DON'T see it, **continue to Part D** (Create the user)

---

### Part D: Create the Admin User (If It Doesn't Exist)

1. **Click "Add user" button**
   - Look for a button in the top right area
   - It says **"Add user"** or has a **"+"** icon
   - Click it

2. **Fill in the user details**
   - A popup or form will appear
   - **Email field:**
     - Type: `admin@speccon.com`
     - Make sure there are no typos
     - No spaces before or after
   - **Password field:**
     - Type: `admin123` (or your preferred password)
     - Minimum 6 characters required
     - Remember this password - you'll need it to log in!

3. **Click "Add user"**
   - At the bottom of the form, click the **"Add user"** button
   - Wait a few seconds

4. **Confirmation**
   - You should see a success message
   - The user will appear in the users list
   - The popup/form will close

✅ **User created! Now continue to Part E**

---

### Part E: Get the UID (User ID)

1. **Find the user in the list**
   - In the "Users" tab, look for `admin@speccon.com`
   - It should be in the list now

2. **Look at the user row**
   - Each user has several columns:
     - Email
     - User UID ← **This is what you need!**
     - Created
     - Last sign in
     - Provider

3. **Find the UID column**
   - The UID is a long string of characters
   - It looks something like:
     ```
     AbCdEfGhIjKlMnOpQrStUvWxYz123456789
     ```
   - Or:
     ```
     a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
     ```
   - It's usually 28 characters long
   - It contains letters and numbers

4. **Copy the UID**
   - **Method 1: Click to copy**
     - Some Firebase consoles let you click the UID to copy it
     - Look for a copy icon (📋) next to the UID
   - **Method 2: Select and copy**
     - Click and drag to select the entire UID
     - Right-click → **"Copy"**
     - Or press `Ctrl+C` (Windows) / `Cmd+C` (Mac)

5. **Save the UID somewhere safe**
   - Paste it into a text file
   - Or keep it in your clipboard
   - You'll need it in the next step!

✅ **UID copied! You're ready for Step 2**

---

## Visual Guide

### What You Should See:

```
Firebase Console
│
├── Left Sidebar:
│   └── Build
│       └── Authentication ← Click here
│
└── Main Area (after clicking Authentication):
    │
    ├── Top Tabs:
    │   ├── Users ← Click this tab
    │   ├── Sign-in method
    │   └── Templates
    │
    └── Users List:
        └── Table with columns:
            ├── Email: admin@speccon.com
            ├── User UID: AbCdEfGhIjKlMnOpQrSt ← COPY THIS!
            ├── Created: [date]
            └── Last sign in: [date]
```

---

## Common Issues & Solutions

### Issue: "Authentication" not visible in sidebar

**Solution:**
- Authentication might not be enabled yet
- Go to **"Sign-in method"** tab
- Enable **"Email/Password"** provider
- Then go back to **"Users"** tab

### Issue: Can't find "Add user" button

**Solution:**
- Make sure you're on the **"Users"** tab (not "Sign-in method")
- Look in the top right corner
- It might say **"Add user"** or have a **"+"** icon
- Try refreshing the page

### Issue: UID column not visible

**Solution:**
- The UID is always there, but columns might be hidden
- Try scrolling horizontally in the table
- Or click on the user row to see details
- The UID will be shown in the user details

### Issue: Can't copy the UID

**Solution:**
- Select the entire UID text
- Right-click → Copy
- Or use keyboard shortcut: `Ctrl+C` / `Cmd+C`
- If that doesn't work, manually type it (but be careful - it's long!)

### Issue: User was deleted or not found

**Solution:**
- Go back to Part D and create the user again
- Make sure you click "Add user" and see confirmation
- Refresh the page if user doesn't appear

---

## What the UID Looks Like

The UID is a unique identifier. Examples:

**Format 1:**
```
aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
```

**Format 2:**
```
abcdefghijklmnopqrstuvwxyz123456
```

**Format 3:**
```
ABCDEFGHIJKLMNOPQRSTUVWXYZ123456
```

**Important:**
- It's usually 28 characters long
- Contains both letters and numbers
- Case-sensitive (uppercase/lowercase matters)
- Must be copied exactly as shown

---

## Verification Checklist

Before moving to Step 2, verify:

- [ ] I'm signed in to Firebase Console
- [ ] I can see my project
- [ ] I'm on the Authentication page
- [ ] I'm on the "Users" tab
- [ ] I can see `admin@speccon.com` in the list
- [ ] I can see the UID column
- [ ] I've copied the UID
- [ ] I've saved the UID somewhere (text file or clipboard)

---

## Next Steps

Once you have the UID:

1. **Keep it handy** - You'll need it in Step 2
2. **Don't lose it** - Write it down if needed
3. **Proceed to Step 2** - Create user profile in Firestore using this UID

---

## Quick Reference

**Where to go:**
- Firebase Console: https://console.firebase.google.com
- Authentication: Build → Authentication → Users tab

**What to look for:**
- User: `admin@speccon.com`
- UID: Long string in "User UID" column

**What to do:**
- Copy the UID exactly as shown
- Save it for Step 2

---

## Still Having Trouble?

If you can't find the UID:

1. **Click on the user row** - This opens user details
2. **Look for "User UID"** - It will be displayed prominently
3. **Check user details panel** - UID is usually at the top
4. **Take a screenshot** - So you can reference it later

---

**Once you have the UID copied, you're ready for Step 2! 🎉**

See `CREATE_ADMIN_USER.md` for Step 2 instructions.
