import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, "users"), {
        email: user.email,
        isDriver,
        userID: user.uid,
        username,
        carModel
      });

      navigate("/");
    } catch (err) {
      const friendlyErrorMessage = getFirebaseErrorMessage(err.code);
      setError(friendlyErrorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Are you a Driver?</label>
          <input
            type="checkbox"
            checked={isDriver}
            onChange={() => setIsDriver(!isDriver)}
            className="w-4 h-4"
          />
        </div>
        {isDriver && (
          <div>
            <label className="block mb-2">Car Model:</label>
            <input
              type="text"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        )}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
}
