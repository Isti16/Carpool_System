import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import ErrorNotification from "./ErrorNotification";

function getFirebaseErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      const friendlyErrorMessage = getFirebaseErrorMessage(err.code);
      setError(friendlyErrorMessage);
    }
  };

  const clearError = () => {
    setError("");
  };

  return (
    <div className="max-w-md mx-auto my-8 p-4 bg-white shadow-md rounded">
      <title>Login</title>
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      {error && <ErrorNotification message={error} clearError={clearError} />}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <label className="block mb-2">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
