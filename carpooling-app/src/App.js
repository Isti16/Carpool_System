import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import PostRide from "./components/PostRide";
import BrowseRides from "./components/BrowseRides";
import BookRide from "./components/BookRide";
import RideBookings from "./components/RideBookings";
import ManageRides from "./components/ManageRides";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-ride" element={<PostRide />} />
            <Route path="/browse-rides" element={<BrowseRides />} />
            <Route path="/book-ride/:rideID" element={<BookRide />} />
            <Route path="/ride-bookings/:rideID" element={<RideBookings />} />
            <Route path="/manage-rides" element={<ManageRides />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
