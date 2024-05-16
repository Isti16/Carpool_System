// src/components/Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import ErrorNotification from "./ErrorNotification";
import SuccessNotification from "./SuccessNotification";

function getFirebaseErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email address is already in use by another account.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/weak-password':
      return 'The password is too weak.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [carModel, setCarModel] = useState("");
  const [isDriver, setIsDriver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        userID: user.uid,
        username: username || "",
        isDriver: isDriver,
        carModel: carModel || ""
      });

      setSuccess("Registration successful!");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      const friendlyErrorMessage = getFirebaseErrorMessage(err.code);
      setError(friendlyErrorMessage);
    }
  };

  const clearError = () => {
    setError("");
  };

  const clearSuccess = () => {
    setSuccess("");
  };

  return (
    <div className="container">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
      {error && <ErrorNotification message={error} clearError={clearError} />}
      {success && <SuccessNotification message={success} clearSuccess={clearSuccess} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-grid">
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Are you a Driver?</label>
            <input
              type="checkbox"
              checked={isDriver}
              onChange={() => setIsDriver(!isDriver)}
            />
          </div>
          {isDriver && (
            <div>
              <label>Car Model:</label>
              <input
                type="text"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                required
              />
            </div>
          )}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
