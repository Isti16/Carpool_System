import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Import auth from firebaseConfig
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
import './styles.css';  // Ensure this file exists in src directory

function App() {
  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/login";
  };

  return (
    <Router>
      <header>
        <div className="header-title">
          <h1>Carpool System</h1>
          <p>Find or offer rides easily!</p>
        </div>
        <nav className="navbar">
          <NavLink to="/" exact="true">Home</NavLink>
          <NavLink to="/browse-rides">Browse Rides</NavLink>
          <NavLink to="/post-ride">Post a Ride</NavLink>
          <NavLink to="/manage-rides">Manage Rides</NavLink>
          {auth.currentUser ? (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="container">
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
