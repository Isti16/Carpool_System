// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Carpool System</div>
        <div className="space-x-4">
          <Link to="/login">
            <button className="bg-blue-700 text-white px-4 py-2 rounded">Login</button>
          </Link>
          <Link to="/register">
            <button className="bg-blue-700 text-white px-4 py-2 rounded">Sign Up</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
