import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
// TODO: Replace with your Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyBxP2Ojmmn0yBhPXcCaeAsux-dNM_DNysA",
    authDomain: "navigo-6253b.firebaseapp.com",
    projectId: "navigo-6253b",
    storageBucket: "navigo-6253b.firebasestorage.app",
    messagingSenderId: "224018111944",
    appId: "1:224018111944:web:a537250270198ea07af4fd",
    measurementId: "G-X5GC0JQ21Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
export default app;
