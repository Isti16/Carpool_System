import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import ErrorNotification from "./ErrorNotification";

export default function ManageRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const userAuth = auth.currentUser;
        if (userAuth) {
          const q = query(collection(db, "rides"), where("driverID", "==", userAuth.uid));
          const snapshots = await getDocs(q);
          setRides(snapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } else {
          navigate("/login");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [navigate]);

  const clearError = () => {
    setError("");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-md rounded">
      <title>Manage Rides</title>
      <h2 className="text-2xl font-bold text-center mb-4">Manage Rides</h2>
      {error && <ErrorNotification message={error} clearError={clearError} />}
      {rides.length > 0 ? (
        <ul>
          {rides.map((ride) => (
            <li key={ride.id} className="mb-4 p-4 bg-gray-100 rounded">
              <h3 className="text-lg font-bold">{ride.origin} to {ride.destination}</h3>
              <p><strong>Departure Time:</strong> {new Date(ride.depTime).toLocaleString()}</p>
              <p><strong>Remaining Seats:</strong> {ride.remainingSeats}</p>
              <Link to={`/ride-bookings/${ride.id}`} className="text-blue-500 underline">View Bookings</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rides posted.</p>
      )}
    </div>
  );
}
