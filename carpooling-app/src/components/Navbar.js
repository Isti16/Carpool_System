// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "@firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Carpool System
        </Link>
        <div className="space-x-4">
          <Link to="/browse-rides">
            <button className="bg-blue-700 text-white px-4 py-2 rounded">Browse Rides</button>
          </Link>
          <Link to="/post-ride">
            <button className="bg-blue-700 text-white px-4 py-2 rounded">Post a Ride</button>
          </Link>
          <Link to="/manage-rides">
            <button className="bg-blue-700 text-white px-4 py-2 rounded">Manage Rides</button>
          </Link>
          <Link to="/profile">
            <button className="bg-blue-700 text-white px-4 py-2 rounded">Profile</button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
