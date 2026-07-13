import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration using active credentials
const firebaseConfig = {
  apiKey: "AIzaSyCWAbQOBTsmv5Wc6rQLzM64FBMcvbDlh94",
  authDomain: "ai-review-e687a.firebaseapp.com",
  projectId: "ai-review-e687a",
  storageBucket: "ai-review-e687a.firebasestorage.app",
  messagingSenderId: "112678241293",
  appId: "1:112678241293:web:709ec9dd164b3c6368c144",
  measurementId: "G-DZTLYQ00Z8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
