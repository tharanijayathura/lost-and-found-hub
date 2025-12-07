# 📸 Firebase Storage Setup Guide

## ⚠️ Important: Enable Firebase Storage

Your app needs Firebase Storage to upload images. If images aren't uploading, Storage might not be enabled!

## 🔍 Check If Storage is Enabled

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **lost-and-found-hub-25a52**
3. Look for **"Storage"** in the left menu
4. Click it

**If you see:**
- ✅ Storage interface with files/folders → **Enabled!**
- ❌ "Get started" or "Create bucket" → **Not enabled yet**

## 🚀 Enable Firebase Storage (2 minutes)

### Step 1: Create Storage Bucket
1. In Firebase Console, click **"Storage"** in left menu
2. Click **"Get started"** or **"Create bucket"**
3. You'll see security rules setup

### Step 2: Choose Security Mode
**Choose "Start in test mode"** (for now)
- ✅ Allows uploads for 30 days
- ✅ Good for development
- ⚠️ Update rules later for production

### Step 3: Choose Location
1. Select a **location** (same as Firestore or closest to you)
2. Click **"Done"** or **"Enable"**
3. Wait 1-2 minutes

### Step 4: Deploy Storage Rules
1. Go to **Storage** → **Rules** tab
2. Copy contents from `storage.rules` file
3. Paste into rules editor
4. Click **"Publish"**

## 📋 Storage Rules (from storage.rules)

Your storage rules should allow:
- ✅ Anyone can read images (to view item images)
- ✅ Authenticated users can upload (max 5MB)
- ✅ Authenticated users can delete

## 🧪 Test Image Upload

After enabling Storage:

1. **Open your app**
2. **Add a new item**
3. **Select an image**
4. **Fill in item details**
5. **Click "Add Item"**
6. **Check Firebase Console** → Storage
7. **You should see:**
   - An `items/` folder
   - Your uploaded image file

## ❌ Common Issues

### Issue: "Uploading image..." stuck forever
**Causes:**
- Storage not enabled
- Storage rules blocking upload
- Network connection issue
- Image too large

**Solutions:**
1. ✅ Enable Storage (see above)
2. ✅ Deploy storage rules
3. ✅ Check internet connection
4. ✅ Try a smaller image

### Issue: "Permission denied"
**Solution:**
- Deploy storage rules from `storage.rules`
- Make sure rules allow authenticated users to write

### Issue: "Network error"
**Solution:**
- Check internet connection
- Try again
- Check Firebase Console for service status

## 📊 Storage Structure

After uploading, your Storage will look like:

```
Storage/
└── items/
    ├── 1234567890_abc123.jpg
    ├── 1234567891_def456.jpg
    └── ...
```

## 💰 Storage Pricing

**Free Tier:**
- ✅ 5 GB storage
- ✅ 1 GB/day downloads
- ✅ 20,000 uploads/day

**More than enough for a university app!**

## ✅ Checklist

- [ ] Storage enabled in Firebase Console
- [ ] Storage rules deployed
- [ ] Test upload works
- [ ] Images appear in Storage
- [ ] Images display in app

---

**Enable Storage now to make image uploads work!** 📸

