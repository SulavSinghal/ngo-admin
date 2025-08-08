import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import Dashboard from './pages/Dashboard';

function App() {
  // Simple auth state based on localStorage token
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      {!isLoggedIn ? (
        showRegister ? (
          <>
            <AdminRegister onRegisterSuccess={handleRegisterSuccess} />
            <button className="mt-3 text-blue-700 underline" onClick={() => setShowRegister(false)}>
              Go to Login
            </button>
          </>
        ) : (
          <>
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
            <button className="mt-3 text-blue-700 underline" onClick={() => setShowRegister(true)}>
              Register New Admin
            </button>
          </>
        )
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
