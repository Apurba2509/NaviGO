# Firebase Setup - UPDATED (Expo Compatible)

## ✅ What You've Already Done
- Created Firebase project
- Added your Firebase config to `config/firebase.ts`
- Added Web Client ID to `context/AuthContext.tsx`
- Downloaded `google-services.json`

## 🔧 What Changed
I've updated the auth system to use **Expo AuthSession** instead of native modules. This means:
- ✅ Works with Expo Go (no need to build native app)
- ✅ Google Sign-In uses web-based OAuth (more reliable)
- ✅ No native module errors

## 📱 How to Test

### 1. Restart Expo Server
```bash
# Press Ctrl+C in terminal, then:
npx expo start --clear
```

### 2. Test Email/Password Auth
1. Open the app
2. Tap the **profile icon** (top-right in search bar)
3. Toggle to **"Sign Up"**
4. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
5. Tap **"Create Account"**
6. Avatar should update to show "T"

### 3. Test Google Sign-In
1. Tap profile icon again
2. Tap **"Continue with Google"**
3. A browser will open for Google login
4. Sign in with your Google account
5. Browser will redirect back to the app
6. Avatar should update with your Google initial

### 4. Test Sign Out
1. Open the **side menu** (hamburger icon ☰)
2. Scroll down
3. Tap **"Sign Out"** (red gradient button)
4. Avatar should change back to "?"

## 🎯 What Works Now
- ✅ Email/Password sign up
- ✅ Email/Password sign in
- ✅ Google Sign-In (web-based)
- ✅ Persistent sessions (stays logged in)
- ✅ Sign out
- ✅ Profile display with avatar/initials

## 🚫 What to Avoid
- **Don't** try to use the app on a physical device without internet
- **Don't** use Expo Go in offline mode for auth testing
- **Make sure** your Firebase project has Email/Password and Google enabled in Authentication settings

## 💡 Tips
- Google Sign-In will open your default browser
- The redirect back to the app is automatic
- Email auth is instant (no browser needed)
- Your session persists across app restarts

## 🐛 Troubleshooting

**Error: "No development build found"**
- Just dismiss and reload (press R in terminal)

**Google Sign-In opens browser but doesn't redirect back**
- Make sure `scheme: "navigo"` is in `app.json`
- Restart Expo with `npx expo start --clear`

**Email auth says "invalid email"**
- Use proper email format: name@domain.com
- Password must be 6+ characters

Try it now! The app should work perfectly with Expo Go. 🚀
