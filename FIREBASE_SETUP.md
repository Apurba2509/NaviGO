# Firebase Setup Guide for NaviGO

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "NaviGO" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Add Android App to Firebase

1. In your Firebase project, click the **Android icon** (⚙️)
2. **Android package name**: `com.yourcompany.navigo` (or check your `app.json`)
3. **App nickname**: NaviGO
4. **SHA-1**: Leave blank for now (you can add later for Google Sign-In)
5. Download `google-services.json`
6. **Place the file in**: `c:/New Project/google-services.json`

## Step 3: Get Firebase Config

1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Scroll down to "Your apps"
3. Click on your Android app
4. You'll see the Firebase SDK configuration
5. Copy these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Step 4: Update Firebase Config File

Open `c:/New Project/config/firebase.ts` and replace the placeholder values:

\`\`\`typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
\`\`\`

## Step 5: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (for Google Sign-In)

## Step 6: Google Sign-In Configuration

1. In Firebase Console, expand **Google** sign-in provider
2. Copy the **Web Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
3. Open `c:/New Project/context/AuthContext.tsx`
4. Replace `YOUR_WEB_CLIENT_ID` with your actual Web Client ID

\`\`\`typescript
GoogleSignin.configure({
  webClientId: '123456789-abc.apps.googleusercontent.com',
});
\`\`\`

## Step 7: Add google-services.json to app.json (Expo)

Open `c:/New Project/app.json` and add:

\`\`\`json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json",
      "package": "com.yourcompany.navigo"
    }
  }
}
\`\`\`

## Step 8: Test Authentication

1. Restart the Expo server: `npx expo start`
2. Open the app on your device
3. Tap the profile icon → Try signing up with email
4. Try Google Sign-In

## Troubleshooting

- **Google Sign-In fails**: Make sure you've added the SHA-1 certificate fingerprint to Firebase
- **Email sign-in fails**: Check that Email/Password is enabled in Firebase Console
- **App crashes**: Verify `google-services.json` is in the root directory

## Note

For production, you'll need to:
1. Generate a release keystore
2. Add its SHA-1 fingerprint to Firebase
3. Update `google-services.json` with production values
