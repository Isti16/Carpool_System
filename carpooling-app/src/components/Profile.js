// src/components/Profile.js
import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "@firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [rideCount, setRideCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userAuth = auth.currentUser;
      if (userAuth) {
        const userDoc = await getDoc(doc(db, "users", userAuth.email));
        setUser(userDoc.data());

        const q = query(collection(db, "rides"), where("driverID", "==", userAuth.uid));
        const rides = await getDocs(q);
        setRideCount(rides.size);
      } else {
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
      <p><strong>User ID:</strong> {user.userID}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Number of Rides Posted:</strong> {rideCount}</p>
    </div>
  );
}
