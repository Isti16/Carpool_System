import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ErrorNotification from "./ErrorNotification";

const PAGE_SIZE = 10; // Number of rides to fetch per page

export default function BrowseRides() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null); // For pagination
  const [hasMore, setHasMore] = useState(true); // To check if more data is available

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, "rides"), orderBy("depTime"), limit(PAGE_SIZE));
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const ridesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        depTime: doc.data().depTime ? new Date(doc.data().depTime) : new Date(),
        remainingSeats: doc.data().remainingSeats || 0,
      }));

      setRides((prevRides) => [...prevRides, ...ridesData]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      // If fewer results than PAGE_SIZE, no more data to fetch
      if (ridesData.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to fetch rides. Please try again later.");
      console.error("Error fetching rides:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchRides();
    }
  };

  const clearError = () => {
    setError("");
  };

  return (
    <div className="container">
      <h2 className="text-2xl font-bold text-center mb-4">Browse Rides</h2>
      {error && <ErrorNotification message={error} clearError={clearError} />}
      <div className="browse-rides-container">
        {rides.map((ride) => (
          <div key={ride.id} className="card">
            <h3 className="text-lg font-bold">{ride.driverName}</h3>
            <p><strong>Origin:</strong> {ride.origin}</p>
            <p><strong>Destination:</strong> {ride.destination}</p>
            <p><strong>Departure Time:</strong> {ride.depTime.toLocaleString()}</p>
            <p><strong>Available Seats:</strong> {ride.remainingSeats}</p>
            <p><strong>Price per Seat:</strong> {ride.price} Ft</p>
          </div>
        ))}
      </div>
      {loading && <div className="spinner"></div>}
      {hasMore && !loading && (
        <button onClick={loadMore} className="button-primary mt-4">
          Load More
        </button>
      )}
      {!hasMore && <p>No more rides available.</p>}
    </div>
  );
}
