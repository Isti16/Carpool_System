// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOYNCwrYvu4qYwcKi_PM8L_0cHvdKqVmc",
  authDomain: "carpool-system-421322.firebaseapp.com",
  projectId: "carpool-system-421322",
  storageBucket: "carpool-system-421322.appspot.com",
  messagingSenderId: "450727304950",
  appId: "1:450727304950:web:6ae1b32db67897e16556d7",
  measurementId: "G-KLFQTLD2C1",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };