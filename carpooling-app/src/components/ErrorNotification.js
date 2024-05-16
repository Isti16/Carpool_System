// src/components/ErrorNotification.js
import React from "react";

export default function ErrorNotification({ message, clearError }) {
  return (
    <div className="bg-red-500 text-white p-2 rounded mb-4 flex justify-between items-center">
      <span>{message}</span>
      <button onClick={clearError} className="text-sm underline">Close</button>
    </div>
  );
}
