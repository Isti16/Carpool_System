import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { auth, onAuthStateChanged } from './firebaseConfig';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import PostRide from './components/PostRide';
import BrowseRides from './components/BrowseRides';
import BookRide from './components/BookRide';
import RideBookings from './components/RideBookings';
import ManageRides from './components/ManageRides';
import ProtectedRoute from './components/ProtectedRoute';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/login";
  };

  return (
    <Router>
      <header className="header">
        <div className="header-title">
          <h1>Carpool System</h1>
          <p>Find or offer rides easily!</p>
        </div>
        <Navbar user={user} handleLogout={handleLogout} />
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<BrowseRides />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-ride" element={<PostRide />} />
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
