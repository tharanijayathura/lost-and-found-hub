# 🔒 Firebase Security Rules Setup Guide

## Important: Set Up Security Rules

Your app now has security rules files, but you need to deploy them to Firebase. This is **CRITICAL** for production!

## Files Created

1. **`firestore.rules`** - Firestore database security rules
2. **`storage.rules`** - Firebase Storage security rules

## How to Deploy Security Rules

### Option 1: Using Firebase Console (Easiest)

1. **Firestore Rules:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to **Firestore Database** → **Rules** tab
   - Copy the contents of `firestore.rules`
   - Paste into the rules editor
   - Click **Publish**

2. **Storage Rules:**
   - Go to **Storage** → **Rules** tab
   - Copy the contents of `storage.rules`
   - Paste into the rules editor
   - Click **Publish**

### Option 2: Using Firebase CLI (Recommended for Production)

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project:**
   ```bash
   firebase init
   ```
   - Select **Firestore** and **Storage**
   - Use existing rules files when prompted

4. **Deploy rules:**
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

## What the Rules Do

### Firestore Rules (`firestore.rules`)

1. **Users Collection:**
   - ✅ Anyone can read (to show item owner names)
   - ✅ Users can only create/update/delete their own profile

2. **Items Collection:**
   - ✅ Anyone can read (to browse lost items)
   - ✅ Only authenticated users can create items
   - ✅ Only item owner can update/delete their items

3. **Favorites Collection:**
   - ✅ Users can only read/create/delete their own favorites

### Storage Rules (`storage.rules`)

1. **Items Images:**
   - ✅ Anyone can read (to view item images)
   - ✅ Only authenticated users can upload (max 5MB)
   - ✅ Only authenticated users can delete

2. **Profile Images:**
   - ✅ Anyone can read
   - ✅ Users can only upload/delete their own images (max 2MB)

## Testing Rules

After deploying, test your rules:

1. **Test as authenticated user:**
   - Try creating an item → Should work
   - Try editing your item → Should work
   - Try editing someone else's item → Should fail

2. **Test as unauthenticated user:**
   - Try reading items → Should work
   - Try creating an item → Should fail
   - Try editing any item → Should fail

## Current Status

⚠️ **Your Firestore is likely in TEST MODE** which allows all reads/writes.

**You MUST deploy these rules before going to production!**

## Security Best Practices

1. ✅ Rules are deployed and active
2. ✅ Users can only modify their own data
3. ✅ Image uploads have size limits
4. ✅ Authentication is required for writes
5. ✅ Read access is public (for browsing items)

## Troubleshooting

### Rules not working?
- Make sure you clicked **Publish** in Firebase Console
- Check that rules syntax is correct (no errors shown)
- Wait a few minutes for rules to propagate

### Getting permission denied?
- Check that user is authenticated
- Verify user owns the resource they're trying to modify
- Check Firebase Console → Rules for any errors

---

**Remember: Security rules are your first line of defense!** 🛡️

