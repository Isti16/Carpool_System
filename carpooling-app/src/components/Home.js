import React from "react";
import BrowseRides from "./BrowseRides";

export default function Home() {
  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-md rounded">
      <title>Carpooling System</title>
      <h2 className="text-2xl font-bold text-center mb-4">Welcome to the Carpooling System</h2>
      <p className="text-center mt-4">Find or offer rides easily!</p>
      <BrowseRides />
    </div>
  );
}
