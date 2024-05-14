import React, { useState, useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebaseConfig";

export default function BrowseRides() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const snapshot = await getDocs(collection(db, "rides"));
        setRides(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError("Failed to fetch rides. Please try again later.");
        console.error("Error fetching rides:", err);
      }
    };

    fetchRides();
  }, []);

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-md rounded">
      <title>Browsing Rides</title>
      <h2 className="text-2xl font-bold text-center mb-4">Browse Rides</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul>
        {rides.map((ride) => (
          <li key={ride.id} className="mb-4 p-4 bg-gray-100 rounded">
            <h3 className="text-lg font-bold">{ride.driverName}</h3>
            <p><strong>Origin:</strong> {ride.origin}</p>
            <p><strong>Destination:</strong> {ride.destination}</p>
            <p><strong>Departure Time:</strong> {new Date(ride.depTime).toLocaleString()}</p>
            <p><strong>Available Seats:</strong> {ride.remainingSeats}</p>
            <p><strong>Price per Seat:</strong> {ride.price} Ft</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
