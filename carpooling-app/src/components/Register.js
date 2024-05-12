import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

function getFirebaseErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This username or email address is already in use by another account.';
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
    <div className="max-w-md mx-auto my-8 p-4 bg-white shadow-lg rounded-lg" style={{ width: '80%' }}>
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <label>Are you a Driver?</label>
          <input type="checkbox" checked={isDriver} onChange={() => setIsDriver(!isDriver)} style={{ width: '20px', height: '20px' }} />
          {isDriver && (
            <>
              <label>Car Model:</label>
              <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </>
          )}
          <button type="submit" style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>Register</button>
        </div>
      </form>
    </div>
  );
}
