import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ user, handleLogout }) {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} end>
        Home
      </NavLink>
      <NavLink to="/post-ride" className={({ isActive }) => isActive ? "active" : ""}>
        Post a Ride
      </NavLink>
      <NavLink to="/manage-rides" className={({ isActive }) => isActive ? "active" : ""}>
        Manage Rides
      </NavLink>
      {user ? (
        <>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
            Profile
          </NavLink>
          <button onClick={handleLogout} className="active">
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
            Login
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>
            Register
          </NavLink>
        </>
      )}
    </nav>
  );
}
