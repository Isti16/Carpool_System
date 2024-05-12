import React, { useState, useEffect } from "react";
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
  const [intermediate, setIntermediate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

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
          intermediate,
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
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-lg rounded-lg" style={{ width: '80%' }}>
      <h2 className="text-2xl font-bold text-center mb-4">Post a Ride</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <label>Origin:</label>
          <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <label>Destination:</label>
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <label>Intermediate Towns:</label>
          <input type="text" value={intermediate} onChange={(e) => setIntermediate(e.target.value)} placeholder="E.g., Town1, Town2, Town3" style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <label>Departure Time:</label>
          <input type="datetime-local" value={depTime} onChange={(e) => setDepTime(e.target.value)} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <label>Available Seats:</label>
          <input type="number" value={availableSeats} onChange={(e) => setAvailableSeats(parseInt(e.target.value, 10))} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <label>Price per Seat:</label>
          <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <label>Car Model:</label>
          <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>Post Ride</button>
        </div>
      </form>
    </div>
  );
}