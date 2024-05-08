// src/components/SuccessNotification.js
import React from "react";

export default function SuccessNotification({ message, clearSuccess }) {
  return (
    <div className="bg-green-500 text-white p-2 rounded mb-4 flex justify-between items-center">
      <span>{message}</span>
      <button onClick={clearSuccess} className="text-sm underline">Close</button>
    </div>
  );
}
