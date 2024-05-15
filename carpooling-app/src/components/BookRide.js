import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import ErrorNotification from "./ErrorNotification";
import SuccessNotification from "./SuccessNotification";

export default function BookRide() {
  const { rideID } = useParams();
  const [ride, setRide] = useState(null);
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const docRef = doc(db, "rides", rideID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRide(docSnap.data());
        } else {
          setError("Ride not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideID]);

  const handleBooking = async (e) => {
    e.preventDefault();
    const userAuth = auth.currentUser;
    if (userAuth) {
      if (ride && ride.remainingSeats >= seatsBooked) {
        try {
          await addDoc(collection(db, "bookings"), {
            bookingID: `${userAuth.uid}-${rideID}`,
            contact: userAuth.email,
            passengerID: userAuth.uid,
            rideID,
            seatsBooked,
          });

          const rideRef = doc(db, "rides", rideID);
          await updateDoc(rideRef, {
            remainingSeats: ride.remainingSeats - seatsBooked,
          });

          setSuccess("Booking successful!");
          setTimeout(() => navigate("/"), 2000);
        } catch (err) {
          setError(err.message);
        }
      } else {
        setError("Not enough seats available");
      }
    } else {
      setError("Please log in to book a ride.");
    }
  };

  const clearError = () => {
    setError("");
  };

  const clearSuccess = () => {
    setSuccess("");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Book Ride</h2>
      {error && <ErrorNotification message={error} clearError={clearError} />}
      {success && <SuccessNotification message={success} clearSuccess={clearSuccess} />}
      <form onSubmit={handleBooking}>
        <p><strong>Driver:</strong> {ride.driverName}</p>
        <p><strong>Origin:</strong> {ride.origin}</p>
        <p><strong>Destination:</strong> {ride.destination}</p>
        <p><strong>Departure Time:</strong> {new Date(ride.depTime).toLocaleString()}</p>
        <p><strong>Remaining Seats:</strong> {ride.remainingSeats}</p>
        <label className="block mb-2 mt-4">Seats to Book:</label>
        <input
          type="number"
          value={seatsBooked}
          onChange={(e) => setSeatsBooked(parseInt(e.target.value, 10))}
          min="1"
          max={ride.remainingSeats}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Book
        </button>
      </form>
    </div>
  );
}
