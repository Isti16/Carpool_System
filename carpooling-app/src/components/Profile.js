import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import ErrorNotification from "./ErrorNotification";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [rideCount, setRideCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError("");
      try {
        const userAuth = auth.currentUser;
        if (userAuth) {
          const userDocRef = doc(db, "users", userAuth.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser(userData);

            const ridesQuery = query(collection(db, "rides"), where("driverID", "==", userAuth.uid));
            const ridesSnap = await getDocs(ridesQuery);

            setRideCount(ridesSnap.size);
          } else {
            setError("User data not found.");
          }
        } else {
          navigate("/login");
        }
      } catch (err) {
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const clearError = () => {
    setError("");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
      {error && <ErrorNotification message={error} clearError={clearError} />}
      {user ? (
        <>
          <p><strong>User ID:</strong> {user.userID}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Number of Rides Posted:</strong> {rideCount}</p>
        </>
      ) : (
        <p>User data not found.</p>
      )}
    </div>
  );
}
