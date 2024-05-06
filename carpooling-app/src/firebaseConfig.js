// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };