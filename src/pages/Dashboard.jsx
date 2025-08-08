import React from 'react';

function Dashboard({ onLogout }) {
  // You can add more admin options here
  return (
    <div className="max-w-md w-full p-6 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Admin Home</h2>
      <p className="mb-6">You are logged in as Admin.</p>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
