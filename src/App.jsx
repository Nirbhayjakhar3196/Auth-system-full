import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css'; // Import simple global stylesheet

/**
 * Root App Component
 * Handles the main layout, central user state, and routing rules.
 */
const App = () => {
  // Central state to store the logged-in user details
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app first loads, check if there is user info stored in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      // Restore the user session
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // Done loading session
  }, []);

  // Show a simple loading indicator while checking localStorage on startup
  if (loading) {
    return <div className="loading-text" style={{ marginTop: '50px' }}>Starting App...</div>;
  }

  return (
    <BrowserRouter>
      {/* 1. Header Navigation Bar (receives user state to update links) */}
      <Navbar user={user} setUser={setUser} />

      {/* 2. Page Routing Setup */}
      <Routes>
        {/* Login Route: Redirects to dashboard if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login setUser={setUser} />}
        />

        {/* Register Route: Redirects to dashboard if already logged in */}
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Dashboard Route (Internal page protection is handled inside Dashboard.jsx) */}
        <Route
          path="/dashboard"
          element={<Dashboard user={user} setUser={setUser} />}
        />

        {/* Catch-all Route: Send unknown links to dashboard (or login) */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
