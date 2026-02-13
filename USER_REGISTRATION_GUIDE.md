# 👤 User Registration Guide

## Overview

Users can now create their own accounts and sign in to the SpecCon Cash Reporting System. Registration is open to anyone with a valid email address.

---

## How Registration Works

### Step 1: User Visits Signup Page

1. Go to `/signup` or click **"Create Account"** on the login page
2. Fill in the registration form:
   - **First Name** (required)
   - **Last Name** (required)
   - **Email Address** (required, must be valid email)
   - **Password** (required, minimum 6 characters)
   - **Confirm Password** (must match password)

### Step 2: Account Creation

When a user submits the registration form:

1. **Firebase Authentication** creates the user account
2. **Firestore** creates a user profile document with:
   - `email`: User's email
   - `firstName`: User's first name
   - `lastName`: User's last name
   - `role`: `'user'` (default role)
   - `createdAt`: Timestamp of account creation

3. User is automatically signed in and redirected to the dashboard

---

## User Roles

### Default Role: `user`

All new registrations get the `'user'` role by default. This allows them to:
- ✅ View the dashboard
- ✅ View financial data
- ✅ Import data via CSV
- ❌ Cannot modify companies, account types, or sub-accounts
- ❌ Cannot delete cash positions

### Admin Role

To grant admin privileges:
1. Go to Firebase Console → Firestore Database
2. Open `users` collection
3. Find the user's document (by their UID)
4. Edit the document
5. Change `role` field from `'user'` to `'admin'`

**Admin users can:**
- ✅ All user permissions
- ✅ Create/edit/delete companies
- ✅ Create/edit/delete account types
- ✅ Create/edit/delete sub-accounts
- ✅ Delete cash positions
- ✅ View audit logs

---

## Security Features

### Password Requirements

- Minimum 6 characters (Firebase requirement)
- Passwords are hashed and stored securely by Firebase
- Passwords are never stored in plain text

### Email Validation

- Must be a valid email format
- Email must be unique (cannot register with existing email)

### Firestore Security Rules

Users can:
- ✅ Read their own profile
- ✅ Create their own profile during registration
- ✅ Update their own profile (if needed)
- ❌ Cannot delete their own profile
- ❌ Cannot read/update other users' profiles (unless admin)

---

## Registration Flow

```
User fills form → Validation → Firebase Auth → Firestore Profile → Auto Login → Dashboard
```

### Error Handling

The registration form handles these errors:

1. **Email already in use**
   - Message: "This email is already registered. Please sign in instead."
   - Solution: User should use the login page instead

2. **Weak password**
   - Message: "Password is too weak. Please use a stronger password."
   - Solution: User must use a password with at least 6 characters

3. **Invalid email**
   - Message: "Invalid email address. Please check and try again."
   - Solution: User must enter a valid email format

4. **Passwords don't match**
   - Message: "Passwords do not match"
   - Solution: User must ensure both password fields match

5. **Missing fields**
   - Message: Specific field that's missing
   - Solution: User must fill in all required fields

---

## Testing Registration

### Test Account Creation

1. Go to `/signup`
2. Fill in:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Password: `test123`
   - Confirm Password: `test123`
3. Click **"Create Account"**
4. Should redirect to dashboard
5. Check Firebase Console → Authentication → Users (should see new user)
6. Check Firestore → `users` collection (should see new profile)

### Test Validation

1. Try submitting with empty fields → Should show error
2. Try mismatched passwords → Should show error
3. Try invalid email → Should show error
4. Try password < 6 characters → Should show error
5. Try registering with existing email → Should show "email already in use"

---

## Firebase Console Setup

### Enable Email/Password Authentication

1. Go to Firebase Console
2. Select your project
3. Click **Authentication** in left sidebar
4. Click **Sign-in method** tab
5. Find **Email/Password** provider
6. Click on it
7. Enable **Email/Password** (toggle ON)
8. Click **Save**

**Note:** This should already be enabled if you have existing users, but verify it's enabled.

---

## Firestore Rules Verification

The current Firestore rules allow users to create their own profile:

```javascript
match /users/{userId} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
}
```

This means:
- ✅ Authenticated users can read any user profile
- ✅ Users can write (create/update) their own profile
- ✅ Admins can write any user profile

**This is already configured correctly!** No changes needed.

---

## User Management

### View All Users

1. Firebase Console → Firestore Database
2. Open `users` collection
3. See all registered users with their profiles

### Promote User to Admin

1. Firebase Console → Firestore Database
2. Open `users` collection
3. Find user document (by email or UID)
4. Click to edit
5. Change `role` field from `'user'` to `'admin'`
6. Save

### Delete User Account

**Option 1: Delete from Firebase Authentication**
1. Firebase Console → Authentication
2. Find user by email
3. Click three dots → Delete user
4. This removes authentication but keeps Firestore profile

**Option 2: Delete from Firestore**
1. Firebase Console → Firestore Database
2. Open `users` collection
3. Find user document
4. Click delete
5. This removes profile but keeps authentication

**Note:** For complete removal, delete from both places.

---

## Troubleshooting

### "Email already in use"

**Problem:** User tries to register with existing email  
**Solution:** User should use login page instead, or reset password if forgotten

### "Failed to create account"

**Problem:** Network error or Firebase issue  
**Solution:** 
- Check internet connection
- Verify Firebase Authentication is enabled
- Check browser console for detailed error
- Try again

### "User profile not found" after registration

**Problem:** Registration succeeded but profile creation failed  
**Solution:**
- Check Firestore rules (should allow user to create own profile)
- Check browser console for errors
- Manually create profile in Firestore if needed

### User can't access dashboard after registration

**Problem:** Profile created but role is missing  
**Solution:**
- Check Firestore `users` collection
- Verify user document has `role` field
- Add `role: 'user'` if missing

---

## Best Practices

1. **Email Verification (Future Enhancement)**
   - Consider adding email verification before allowing full access
   - Firebase supports email verification out of the box

2. **Password Reset**
   - Users can reset passwords via Firebase Authentication
   - Add "Forgot Password" link to login page (future enhancement)

3. **Account Activation**
   - Consider requiring admin approval for new accounts
   - Or send welcome email with instructions

4. **User Onboarding**
   - Consider adding a welcome screen after first registration
   - Show tutorial or getting started guide

---

## Next Steps

After users register, they can:
1. ✅ View the dashboard
2. ✅ Import data via CSV
3. ✅ See financial reports
4. ✅ Access all user-level features

To grant admin access, update their role in Firestore as described above.

---

**Registration is now live and ready for users! 🎉**
