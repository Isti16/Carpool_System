// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOYNCwrYvu4qYwcKi_PM8L_0cHvdKqVmc",
  authDomain: "carpool-system-421322.firebaseapp.com",
  projectId: "carpool-system-421322",
  storageBucket: "carpool-system-421322.appspot.com",
  messagingSenderId: "450727304950",
  appId: "1:450727304950:web:6ae1b32db67897e16556d7",
  measurementId: "G-KLFQTLD2C1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline data persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log("Multiple tabs open, persistence can only be enabled in one tab at a time.");
  } else if (err.code === 'unimplemented') {
    console.log("The current browser does not support all of the features required to enable persistence");
  }
});

export { app, auth, db };