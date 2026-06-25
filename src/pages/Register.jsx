import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

/**
 * Register Page Component
 * Handles new user registration with local validation and loading state.
 */
const Register = () => {
  const navigate = useNavigate();

  // Local component states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear errors
    setSuccess(''); // Clear success alerts

    // Simple validation checks
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Call simple register service helper
      const data = await authService.register(name, email, password);
      
      // Display success message from backend
      setSuccess(data.message || 'User Registered Successfully!');
      
      // Clear input fields
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Capture and display error messages sent by the backend API
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2 className="card-title">Register</h2>
        <p className="card-subtitle">Create a new account</p>

        {/* Display validation or API error messages */}
        {error && <div className="alert alert-danger" id="register-error">{error}</div>}

        {/* Display success messages */}
        {success && <div className="alert alert-success" id="register-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="name-input">Full Name</label>
            <input
              type="text"
              id="name-input"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <input
              type="email"
              id="email-input"
              className="form-input"
              placeholder="john@example.com"
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

          {/* Confirm Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password-input">Confirm Password</label>
            <input
              type="password"
              id="confirm-password-input"
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            id="register-btn"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

          {/* Redirect to Login Page */}
          <div className="auth-redirect">
            Already have an account?{' '}
            <Link to="/login" className="auth-redirect-link">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
