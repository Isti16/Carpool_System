import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit, startAfter, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ErrorNotification from "./ErrorNotification";

const PAGE_SIZE = 10;

export default function BrowseRides() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null); // For pagination
  const [hasMore, setHasMore] = useState(true); // To check for more data

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setLoading(true);
    try {
      let baseQuery = query(
        collection(db, "rides"),
        orderBy("depTime", "desc"),
        where("remainingSeats", ">", 0) // Filter for available seats
      );

      const queryWithLimit = lastDoc
        ? query(baseQuery, startAfter(lastDoc), limit(PAGE_SIZE))
        : query(baseQuery, limit(PAGE_SIZE));

      console.log("Executing query:", queryWithLimit);

      const snapshot = await getDocs(queryWithLimit);
      console.log("Snapshot:", snapshot);

      if (!snapshot.empty) {
        const ridesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Document data:", data);
          return {
            id: doc.id,
            ...data,
            depTime: new Date(data.depTime), // Convert string to Date object
          };
        });

        console.log("Fetched rides data: ", ridesData);

        if (lastDoc) {
          setRides((prevRides) => [...prevRides, ...ridesData]);
        } else {
          setRides(ridesData);
        }
        
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

        if (snapshot.docs.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError("Failed to fetch rides. Please try again later.");
      console.error("Error fetching rides:", error);
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
    <div className="container mx-auto my-8 p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Browse Rides</h2>
      {error && <ErrorNotification message={error} clearError={clearError} />}
      <div className="browse-rides-container">
        {rides.length === 0 && !loading && <p>No rides available.</p>}
        {rides.map((ride) => (
          <div key={ride.id} className="card">
            <h3 className="text-lg font-bold">{ride.driverName}</h3>
            <p><strong>Origin:</strong> {ride.origin}</p>
            <p><strong>Destination:</strong> {ride.destination}</p>
            <p><strong>Departure Time:</strong> {ride.depTime.toLocaleString()}</p>
            <p><strong>Available Seats:</strong> {ride.remainingSeats}</p>
            <p><strong>Price per Seat:</strong> {ride.price} Ft</p>
            <Link to={`/book-ride/${ride.id}`} className="button-primary mt-4">
              Book Ride
            </Link>
          </div>
        ))}
      </div>
      {loading && <div className="spinner"></div>}
      {hasMore && !loading && rides.length > 0 && (
        <button onClick={loadMore} className="button-primary mt-4">
          Load More
        </button>
      )}
    </div>
  );
}
