# 🔍 Check Your Admin Role

## Quick Check

If the "Import Data" link is not showing, verify your admin role:

### Step 1: Check Firebase Console

1. Go to **Firebase Console** → **Firestore Database**
2. Open the **`users`** collection
3. Find your user document (by your UID or email)
4. Check the **`role`** field

**It should say:** `admin` (lowercase, exactly)

### Step 2: Common Issues

#### Issue 1: Role is "user" instead of "admin"
**Fix:**
1. Edit the user document
2. Change `role` from `"user"` to `"admin"`
3. Save
4. Refresh the app

#### Issue 2: Role field is missing
**Fix:**
1. Edit the user document
2. Add field: `role` (type: string)
3. Set value: `admin`
4. Save
5. Refresh the app

#### Issue 3: Role has wrong case
**Fix:**
- Must be lowercase: `admin` ✅
- Not: `Admin` ❌ or `ADMIN` ❌

### Step 3: Verify in Browser Console

1. Open browser console (F12)
2. Type: `localStorage` (to see if there's cached data)
3. Or check the Network tab to see if user profile is being fetched

### Step 4: Hard Refresh

After updating your role in Firestore:
1. **Hard refresh** the browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Or **clear cache** and reload
3. The "Import Data" link should appear

---

## Debug: Check Your Current Role

The Layout component now properly waits for the profile to load. If you're still not seeing the link:

1. **Check browser console** for any errors
2. **Verify your UID** matches the Firestore document ID
3. **Check the role field** is exactly `"admin"` (lowercase)

---

## Still Not Working?

If the link still doesn't appear after:
- ✅ Verifying role is `"admin"` in Firestore
- ✅ Hard refreshing the browser
- ✅ Checking for console errors

Then:
1. **Log out and log back in** (this refreshes the user profile)
2. **Check the Network tab** to see if the user profile is being fetched correctly
3. **Verify Firestore rules** allow reading user profiles

---

**The fix I just made ensures the Layout waits for the profile to load before checking the role!**
