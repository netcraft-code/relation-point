// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, RecaptchaVerifier } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAql-NXX-EdVBauJ0SZBZOgzg4RSzGyIUk",
  authDomain: "relationpoint-aab5e.firebaseapp.com",
  projectId: "relationpoint-aab5e",
  storageBucket: "relationpoint-aab5e.appspot.com",
  messagingSenderId: "599161833951",
  appId: "1:599161833951:web:b4f0b5aabf9e70d014dc6a",
  measurementId: "G-9G121C0T2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Phone auth with reCAPTCHA helper
export const createRecaptcha = () => {
  return new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA Solved");
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired, refresh needed");
      }
    }
  );
};

export default app;
