import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ErrorNotification from "./ErrorNotification";

export default function RideBookings() {
  const { rideID } = useParams();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("rideID", "==", rideID)
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsData = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookings();
  }, [rideID]);

  const clearError = () => {
    setError("");
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Ride Bookings</h2>
      {error && <ErrorNotification message={error} clearError={clearError} />}
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="mb-4 p-4 bg-gray-100 rounded">
              <p><strong>Contact:</strong> {booking.contact}</p>
              <p><strong>Seats Booked:</strong> {booking.seatsBooked}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
}
