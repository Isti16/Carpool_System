import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const linkStyle = {
    color: 'white',
    padding: '8px 15px',
    margin: '0 5px',
    borderRadius: '15px',
    backgroundColor: 'transparent',
    border: '1px solid white'
  };

  const activeStyle = {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8'
  };

  return (
    <nav style={{ backgroundColor: '#007bff', padding: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%', margin: '0 auto' }}>
        <NavLink to="/" style={{ ...linkStyle, fontWeight: 'bold', fontSize: '20px' }} end>
          Carpool System
        </NavLink>
        <div>
          <NavLink to="/browse-rides" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
            Browse Rides
          </NavLink>
          <NavLink to="/post-ride" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
            Post a Ride
          </NavLink>
          <NavLink to="/manage-rides" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
            Manage Rides
          </NavLink>
          {auth.currentUser ? (
            <>
              <NavLink to="/profile" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                style={{ ...linkStyle, backgroundColor: '#e11d48', borderColor: '#e11d48' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
                Login
              </NavLink>
              <NavLink to="/register" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
