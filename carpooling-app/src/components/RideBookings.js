// src/components/RideBookings.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "@firebase/firestore";
import { db } from "../firebaseConfig";

export default function RideBookings() {
  const { rideID } = useParams();
  const [ride, setRide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRideData = async () => {
      try {
        const rideDoc = await getDoc(doc(db, "rides", rideID));
        if (rideDoc.exists()) {
          setRide(rideDoc.data());

          const bookingsQuery = query(collection(db, "bookings"), where("rideID", "==", rideID));
          const bookingSnapshots = await getDocs(bookingsQuery);
          setBookings(bookingSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } else {
          setError("Ride not found.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRideData();
  }, [rideID]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!ride) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-md rounded">
      <title>Bookings for Ride</title>
      <h2 className="text-2xl font-bold text-center mb-4">Bookings for Ride</h2>
      <p><strong>Driver:</strong> {ride.driverName}</p>
      <p><strong>Origin:</strong> {ride.origin}</p>
      <p><strong>Destination:</strong> {ride.destination}</p>
      <p><strong>Departure Time:</strong> {new Date(ride.depTime).toLocaleString()}</p>
      <p><strong>Remaining Seats:</strong> {ride.remainingSeats}</p>
      <h3 className="text-xl font-bold mt-4">Bookings:</h3>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="mb-2 p-2 bg-gray-100 rounded">
              <p><strong>Passenger:</strong> {booking.contact}</p>
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
