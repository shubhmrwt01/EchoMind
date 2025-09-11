// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore}from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "echomind-b8f6a.firebaseapp.com",
  projectId: "echomind-b8f6a",
  storageBucket: "echomind-b8f6a.firebasestorage.app",
  messagingSenderId: "467288919512",
  appId: "1:467288919512:web:75d476b3abd5bb10b9b6ad",
  measurementId: "G-Z4X8KF0T85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);