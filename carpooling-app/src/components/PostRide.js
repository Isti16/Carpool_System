// src/components/PostRide.js
import React, { useState } from "react";
import { addDoc, collection } from "@firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function PostRide() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [depTime, setDepTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState(0);
  const [price, setPrice] = useState(0);
  const [carModel, setCarModel] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userAuth = auth.currentUser;
    if (userAuth) {
      try {
        await addDoc(collection(db, "rides"), {
          availableSeats,
          contact: userAuth.email,
          depTime: new Date(depTime),
          destination,
          driverID: userAuth.uid,
          driverName: userAuth.displayName || userAuth.email,
          origin,
          remainingSeats: availableSeats,
          rideID: `${userAuth.uid}-${Date.now()}`,
          intermediate: "",
          price,
          carModel
        });

        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("Please log in to post a ride.");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Post a Ride</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <label className="block mb-2">Departure Time:</label>
        <input
          type="datetime-local"
          value={depTime}
          onChange={(e) => setDepTime(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <label className="block mb-2">Available Seats:</label>
        <input
          type="number"
          value={availableSeats}
          onChange={(e) => setAvailableSeats(parseInt(e.target.value, 10))}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <label className="block mb-2">Price per Seat:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <label className="block mb-2">Car Model:</label>
        <input
          type="text"
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Post Ride
        </button>
      </form>
    </div>
  );
}
