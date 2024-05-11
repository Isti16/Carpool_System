// src/components/BrowseRides.js
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "@firebase/firestore";
import { db } from "../firebaseConfig";

export default function BrowseRides() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [rides, setRides] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = query(
      collection(db, "rides"),
      where("origin", "==", origin),
      where("destination", "==", destination)
    );

    const snapshot = await getDocs(q);
    const results = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(
        (ride) => !date || new Date(ride.depTime).toLocaleDateString() === new Date(date).toLocaleDateString()
      );

    setRides(results);
  };

  useEffect(() => {
    const fetchRides = async () => {
      const snapshot = await getDocs(collection(db, "rides"));
      setRides(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchRides();
  }, []);

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-md rounded">
      <title>Browsing Rides</title>
      <h2 className="text-2xl font-bold text-center mb-4">Browse Rides</h2>
      <form onSubmit={handleSearch} className="mb-8">
        <label className="block mb-2">Origin:</label>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <label className="block mb-2">Destination:</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <label className="block mb-2">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>
      <ul>
        {rides.map((ride) => (
          <li key={ride.id} className="mb-4 p-4 bg-gray-100 rounded">
            <h3 className="text-lg font-bold">{ride.driverName}</h3>
            <p><strong>Origin:</strong> {ride.origin}</p>
            <p><strong>Destination:</strong> {ride.destination}</p>
            <p><strong>Departure Time:</strong> {ride.depTime}</p>
            <p><strong>Available Seats:</strong> {ride.remainingSeats}</p>
            <p><strong>Price per Seat:</strong> {ride.price} Ft</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
