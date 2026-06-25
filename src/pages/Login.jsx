import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

/**
 * Login Page Component
 * Handles user login with local validation, loading status, and error display.
 */
const Login = ({ setUser }) => {
  const navigate = useNavigate();

  // Local component states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(''); // Clear any previous errors

    // Simple client-side validation checks
    if (!email) {
      setValidationError('Email is required.');
      return;
    }
    if (!password) {
      setValidationError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // Call the simple login service helper
      const data = await authService.login(email, password);
      
      // Update the user state in App.jsx to log the user in
      setUser(data.user);
      
      // Redirect to the protected dashboard
      navigate('/dashboard');
    } catch (error) {
      // Capture and display error messages sent by the backend API
      const errMsg = error.response?.data?.message || 'Invalid email or password.';
      setValidationError(errMsg);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2 className="card-title">Login</h2>
        <p className="card-subtitle">Sign in to your account</p>

        {/* Display validation or API error messages */}
        {validationError && (
          <div className="alert alert-danger" id="login-error">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <input
              type="email"
              id="email-input"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <input
              type="password"
              id="password-input"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            id="login-btn"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>

          {/* Redirect to Register Page */}
          <div className="auth-redirect">
            Don't have an account?{' '}
            <Link to="/register" className="auth-redirect-link">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
