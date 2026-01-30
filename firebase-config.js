// ===========================
// Firebase Configuration
// ===========================
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Enable Authentication > Sign-in method > Google (toggle ON)
// 4. Enable Firestore Database > Create database > Start in production mode
// 5. Go to Project Settings > Your apps > Web app (</> icon)
// 6. Copy your Firebase config and paste below
//
// FIRESTORE RULES (Security):
// Go to Firestore Database > Rules and paste this:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own snippets
    match /users/{userId}/snippets/{snippetId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/

// Replace this with YOUR Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (only if config is set)
let app, auth, db;
let isFirebaseConfigured = false;

function initializeFirebase() {
    // Check if config has been updated
    if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
        console.warn('⚠️ Firebase not configured. Using localStorage only.');
        isFirebaseConfigured = false;
        return false;
    }
    
    try {
        // Initialize Firebase
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        
        // Enable offline persistence
        db.enablePersistence()
            .catch((err) => {
                if (err.code == 'failed-precondition') {
                    console.warn('Persistence failed: Multiple tabs open');
                } else if (err.code == 'unimplemented') {
                    console.warn('Persistence not available in this browser');
                }
            });
        
        isFirebaseConfigured = true;
        console.log('✅ Firebase initialized successfully!');
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        isFirebaseConfigured = false;
        return false;
    }
}
