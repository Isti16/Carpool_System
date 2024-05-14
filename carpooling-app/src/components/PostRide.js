import React, { useState, useEffect } from "react";
import { addDoc, collection } from "@firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import ErrorNotification from "./ErrorNotification";
import SuccessNotification from "./SuccessNotification";

export default function PostRide() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [depTime, setDepTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState(0);
  const [price, setPrice] = useState(0);
  const [carModel, setCarModel] = useState("");
  const [intermediate, setIntermediate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setSuccess(""); // Clear any previous success messages

    const userAuth = auth.currentUser;
    if (userAuth) {
      if (origin && destination && depTime && availableSeats > 0 && price >= 0 && carModel) {
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
            intermediate,
            price,
            carModel
          });
          setSuccess("Ride posted successfully!");
          setTimeout(() => navigate("/"), 2000);
        } catch (err) {
          setError(err.message);
        }
      } else {
        setError("All fields must be filled out correctly.");
      }
    } else {
      setError("Please log in to post a ride.");
    }
  };

  const clearError = () => {
    setError("");
  };

  const clearSuccess = () => {
    setSuccess("");
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Post a Ride</h2>
      {error && <ErrorNotification message={error} clearError={clearError} />}
      {success && <SuccessNotification message={success} clearSuccess={clearSuccess} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Origin:</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label>Intermediate Towns:</label>
          <input
            type="text"
            value={intermediate}
            onChange={(e) => setIntermediate(e.target.value)}
            placeholder="E.g., Town1, Town2, Town3"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label>Departure Time:</label>
          <input
            type="datetime-local"
            value={depTime}
            onChange={(e) => setDepTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label>Available Seats:</label>
          <input
            type="number"
            value={availableSeats}
            onChange={(e) => setAvailableSeats(parseInt(e.target.value, 10))}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label>Price per Seat:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label>Car Model:</label>
          <input
            type="text"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
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
