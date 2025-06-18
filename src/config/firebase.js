import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDCTIqdZfzDX0qShc7a9Z3RPyrZdfK6nHk",
  authDomain: "famto-aa73e.firebaseapp.com",
  projectId: "famto-aa73e",
  storageBucket: "famto-aa73e.appspot.com",
  messagingSenderId: "773492185977",
  appId: "1:773492185977:web:f4e7cddd640c81642c2da8",
  measurementId: "G-TZWB7D4GJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);