# 🗄️ Firestore Database Setup Guide

## What is Firestore?

**Firestore** is Firebase's NoSQL cloud database. It's what stores all your app data:
- User profiles (`users` collection)
- Lost items (`items` collection)
- Favorites (`favorites` collection)

## ✅ Good News: Firestore is Already Configured in Your Code!

Your app is already set up to use Firestore. Look at `config/firebase.ts`:

```typescript
export const db = getFirestore(app);
```

This means your code is ready to use Firestore!

## ⚠️ But You Need to Enable It in Firebase Console

Firestore databases are **NOT automatically created**. You need to enable it manually in Firebase Console.

## 📋 Step-by-Step: Enable Firestore Database

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your project: **lost-and-found-hub-25a52**

### Step 2: Enable Firestore Database
1. In the left sidebar, click **"Firestore Database"**
2. You'll see one of two screens:

   **Option A: "Create database" button**
   - Click **"Create database"**
   - Skip to Step 3

   **Option B: "Get started" button**
   - Click **"Get started"**
   - Skip to Step 3

### Step 3: Choose Database Mode
You'll be asked to choose a mode:

**Choose "Start in test mode"** (for now)
- ✅ Allows reads and writes for 30 days
- ✅ Good for development and testing
- ⚠️ After 30 days, you'll need to set up security rules

**OR "Start in production mode"** (if you want to set up rules now)
- Requires security rules immediately
- More secure but needs configuration

**Recommendation:** Choose **"Start in test mode"** for now.

### Step 4: Choose Location
1. Select a **location** for your database
   - Choose the closest region to your users
   - For example: `us-central` (United States) or `europe-west` (Europe)
   - **Note:** You can't change this later!
2. Click **"Enable"**
3. Wait 1-2 minutes for Firestore to initialize

### Step 5: Verify It's Working
1. You should see the Firestore Database screen
2. It will show: **"No data yet"** or an empty database
3. This is normal! Data will appear when you use the app

## 🎯 What Happens Next?

Once Firestore is enabled:

1. **When you register a user:**
   - A document is created in `users` collection
   - You'll see it in Firebase Console → Firestore Database

2. **When you add an item:**
   - A document is created in `items` collection
   - You'll see it in Firebase Console

3. **When you favorite an item:**
   - A document is created in `favorites` collection

## 📊 Your Database Structure

Once enabled, your Firestore will have these **collections**:

### 1. `users` Collection
```
users/
  └── {userId}/
      ├── name: "John Doe"
      ├── email: "john@example.com"
      ├── phone: ""
      ├── studentId: "STU12345"
      └── profileImageUri: "https://..."
```

### 2. `items` Collection
```
items/
  └── {itemId}/
      ├── title: "Lost iPhone"
      ├── description: "..."
      ├── location: "Library"
      ├── date: "2025-01-15"
      ├── category: "Electronics"
      ├── imageUri: "https://..."
      ├── userId: "user123"
      ├── userName: "John Doe"
      ├── userEmail: "john@example.com"
      ├── status: "pending"
      └── createdAt: Timestamp
```

### 3. `favorites` Collection
```
favorites/
  └── {favoriteId}/
      ├── userId: "user123"
      ├── itemId: "item456"
      └── createdAt: Timestamp
```

## 🔍 How to Check If Firestore is Enabled

### Method 1: Check Firebase Console
1. Go to Firebase Console
2. Click "Firestore Database" in left menu
3. If you see the database interface → ✅ Enabled
4. If you see "Create database" → ❌ Not enabled yet

### Method 2: Try Using the App
1. Try to register a new user
2. If it works → ✅ Firestore is enabled
3. If you get an error like "Firestore is not enabled" → ❌ Need to enable it

## ⚠️ Common Errors

### Error: "Firestore is not enabled"
**Solution:** Follow Step 2 above to enable Firestore

### Error: "Permission denied"
**Solution:** 
- Make sure you chose "Start in test mode"
- Or deploy the security rules from `firestore.rules`

### Error: "Failed to get document because the client is offline"
**Solution:**
- Check your internet connection
- Firestore needs internet to work

## 🔒 Security Rules (Important!)

After enabling Firestore, you should deploy security rules:

1. Go to Firebase Console → Firestore Database → Rules tab
2. Copy the contents of `firestore.rules` file
3. Paste into the rules editor
4. Click "Publish"

**See `SECURITY_RULES_SETUP.md` for detailed instructions.**

## 💰 Firestore Pricing

**Free Tier (Spark Plan):**
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 20,000 deletes/day
- ✅ 1 GB storage
- ✅ 10 GB/month network egress

**This is MORE than enough for a university app!**

## ✅ Checklist

- [ ] Go to Firebase Console
- [ ] Click "Firestore Database"
- [ ] Click "Create database" or "Get started"
- [ ] Choose "Start in test mode"
- [ ] Select a location
- [ ] Click "Enable"
- [ ] Wait for initialization
- [ ] Verify database is created
- [ ] (Optional) Deploy security rules

## 🎉 Once Enabled

Your app will automatically:
- ✅ Store user data when they register
- ✅ Store items when they add lost items
- ✅ Store favorites when they favorite items
- ✅ Sync data in real-time across all devices

---

**Firestore is the database your app uses. Enable it now to make your app fully functional!** 🚀

