import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import ErrorNotification from "./ErrorNotification";
import SuccessNotification from "./SuccessNotification";

export default function PostRide() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [depTime, setDepTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [price, setPrice] = useState("");
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
    setError("");
    setSuccess("");

    const userAuth = auth.currentUser;
    if (userAuth) {
      try {
        await addDoc(collection(db, "rides"), {
          origin,
          destination,
          depTime: new Date(depTime).toISOString(),
          availableSeats: parseInt(availableSeats, 10),
          contact: userAuth.email,
          driverID: userAuth.uid,
          driverName: userAuth.displayName || userAuth.email,
          remainingSeats: parseInt(availableSeats, 10),
          intermediate,
          price: parseFloat(price),
          carModel
        });

        setSuccess("Ride posted successfully!");
        setTimeout(() => navigate("/"), 2000);
      } catch (err) {
        setError(err.message);
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
    <div className="container">
      <h2 className="text-2xl font-bold text-center mb-4">Post a Ride</h2>
      {error && <ErrorNotification message={error} clearError={clearError} />}
      {success && <SuccessNotification message={success} clearSuccess={clearSuccess} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-grid">
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
              onChange={(e) => setAvailableSeats(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label>Price per Seat:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
        </div>
        <button
          type="submit"
          className="button-primary w-full"
        >
          Post Ride
        </button>
      </form>
    </div>
  );
}
