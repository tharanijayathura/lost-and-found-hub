# Complete Firebase Setup Guide - Step by Step

## Part 1: Create Firebase Account & Project

### Step 1: Create Google Account (if you don't have one)
1. Go to https://accounts.google.com/signup
2. Create a Google account (you'll need this for Firebase)

### Step 2: Create Firebase Account
1. Go to https://console.firebase.google.com/
2. Click "Get Started" or "Sign In"
3. Sign in with your Google account

### Step 3: Create Your First Project
1. Click "Add project" or "Create a project"
2. **Project name**: Enter "lost-and-found-hub" (or any name you like)
3. Click "Continue"
4. **Google Analytics**: 
   - You can enable it (recommended) or disable it
   - If enabled, select or create an Analytics account
   - Click "Continue"
5. Click "Create project"
6. Wait for project creation (takes 30-60 seconds)
7. Click "Continue" when done

## Part 2: Add Your App to Firebase

### Step 4: Register Your App
1. In Firebase Console, you'll see "Add an app" options
2. Click the **Android** icon (even if you're using Expo)
3. **Android package name**: 
   - For Expo, use: `com.lostandfoundhub.app` (or similar)
   - You can change this later
4. **App nickname** (optional): "Lost & Found Hub"
5. **Debug signing certificate** (optional): Skip for now
6. Click "Register app"

### Step 5: Download Configuration File
1. You'll see instructions to download `google-services.json`
2. **For Expo**: We'll use a different method (see below)
3. Click "Next" through the setup steps
4. Click "Continue to console"

## Part 3: Enable Firebase Services

### Step 6: Enable Authentication
1. In Firebase Console, click "Authentication" in left menu
2. Click "Get started"
3. Click "Sign-in method" tab
4. Click "Email/Password"
5. Toggle "Enable" to ON
6. Click "Save"

### Step 7: Enable Firestore Database
1. Click "Firestore Database" in left menu
2. Click "Create database"
3. Select "Start in test mode" (we'll secure it later)
4. Click "Next"
5. Choose a location (select closest to you)
6. Click "Enable"

### Step 8: Enable Storage (for images)
1. Click "Storage" in left menu
2. Click "Get started"
3. Select "Start in test mode"
4. Click "Next"
5. Use default location or choose one
6. Click "Done"

## Part 4: Get Firebase Configuration

### Step 9: Get Your Firebase Config
1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. You'll see your app listed
5. Look for "SDK setup and configuration"
6. Copy these values (we'll need them):
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

**OR** if you see "Config" option, click it to see the config object.

## Part 5: Install Firebase in Your Project

### Step 10: Install Firebase SDK
Open your terminal in the project folder and run:

```bash
npm install firebase
```

## Part 6: Configure Firebase in Your App

### Step 11: Create Firebase Config File
I'll help you create a `firebase.ts` file with your configuration.

## Part 7: Update Your Code

### Step 12: Update Authentication
I'll help you update `AuthContext.tsx` to use Firebase Auth.

### Step 13: Update Items
I'll help you update `ItemContext.tsx` to use Firestore.

### Step 14: Update Image Upload
I'll help you update image upload to use Firebase Storage.

## What You'll Need to Share With Me

After completing Steps 1-9, please share:
1. Your Firebase project ID
2. Your Firebase config values (apiKey, authDomain, etc.)

**OR** I can guide you through each step live!

---

## Quick Checklist

- [ ] Created Google account
- [ ] Created Firebase account
- [ ] Created Firebase project
- [ ] Enabled Authentication (Email/Password)
- [ ] Enabled Firestore Database
- [ ] Enabled Storage
- [ ] Got Firebase config values
- [ ] Installed Firebase SDK
- [ ] Ready for code integration

---

**Ready to start? Let me know when you've completed Steps 1-9, and I'll help you with the code integration!**

