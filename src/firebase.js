// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyCUbUHkJ_uj1vnFW1vtpyFxzXeor9YOzdw",
  authDomain: "calorietracker-95866.firebaseapp.com",
  projectId: "calorietracker-95866",
  storageBucket: "calorietracker-95866.appspot.com",
  messagingSenderId: "922629953271",
  appId: "1:922629953271:web:1b009f95712a97727625f2",
  measurementId: "G-H09X3VR556",
};

// ✅ создаём app и db
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ экспортируем db обязательно!
export { db };
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();   
