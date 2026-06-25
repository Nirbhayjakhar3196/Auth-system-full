import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

/**
 * Dashboard Page Component
 * Guards access and displays authenticated user details retrieved from the backend API.
 */
const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Local page states
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Guard route: redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 2. Fetch fresh user details from backend on load
  useEffect(() => {
    const fetchUserProfile = async () => {
      // If there is no user in state yet, don't execute
      if (!user) return;

      try {
        setLoading(true);
        // Call the service with inline automatic token refresh
        const data = await authService.getProfile();
        // Save the profile details returned from database
        setProfileData(data.user);
      } catch (err) {
        console.error('Session expired or access denied:', err);
        setErrorMessage('Your session has expired. Redirecting to login...');
        
        // Force logout on the frontend since tokens are invalid
        localStorage.clear();
        setUser(null);
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, setUser, navigate]);

  // If page is verifying or loading API data, show simple loading text
  if (!user) {
    return null; // Component will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-text">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-container">
        <h2 className="card-title">Dashboard</h2>
        <p className="card-subtitle">Welcome back to your secure dashboard!</p>

        {/* Display session expiration alert */}
        {errorMessage && (
          <div className="alert alert-danger">
            {errorMessage}
          </div>
        )}

        {/* Display profile information in a simple CRUD style table */}
        {profileData && (
          <div>
            <h3>Hello, {profileData.name}!</h3>
            <table className="info-table">
              <tbody>
                <tr>
                  <td>Database ID:</td>
                  <td id="user-id">{profileData._id}</td>
                </tr>
                <tr>
                  <td>Full Name:</td>
                  <td id="user-name">{profileData.name}</td>
                </tr>
                <tr>
                  <td>Email Address:</td>
                  <td id="user-email">{profileData.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
