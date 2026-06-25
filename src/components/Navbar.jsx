import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

/**
 * Navbar Component
 * Displays navigation links. Receives "user" and "setUser" as props from App.jsx.
 */
const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Handle logout button click
  const handleLogout = async () => {
    // 1. Call authService to notify backend and clear localStorage tokens
    await authService.logout();
    
    // 2. Clear user state in App.jsx to update the UI
    setUser(null);
    
    // 3. Redirect user to the login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Brand logo: routes to dashboard if logged in, otherwise login page */}
      <Link to={user ? '/dashboard' : '/login'} className="navbar-brand">
        🛡️ SecureAuth
      </Link>

      <div className="navbar-links">
        {user ? (
          // Links visible only to logged-in users
          <>
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
            <span className="navbar-user">
              👤 {user.name}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          // Links visible to visitors/logged-out users
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
