import axios from 'axios';

// The URL of our Node backend. Vite will read this from the .env file.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * 1. Register a new user
 */
export const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
  });
  return response.data; // Return registration success message
};

/**
 * 2. Log in a user and store tokens in localStorage
 */
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  
  const data = response.data;
  
  // If we receive tokens and user info, save them in localStorage
  if (data.accessToken && data.refreshToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  return data;
};

/**
 * 3. Log out a user by invalidating the refresh token and clearing localStorage
 */
export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  try {
    if (refreshToken) {
      // Notify backend to remove the token from the database
      await axios.post(`${API_URL}/auth/logout`, { refreshToken });
    }
  } catch (error) {
    console.error('Logout error on backend:', error);
  } finally {
    // Always clear localStorage on frontend no matter what
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

/**
 * 4. Request a new access token using our refresh token
 */
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
    const newAccessToken = response.data.accessToken;
    
    // Save the new access token
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // If the refresh token has expired or is invalid, perform clean-up
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return null;
  }
};

/**
 * 5. Fetch user profile with inline 401 (Unauthorized) retry logic
 */
export const getProfile = async () => {
  let token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    // Attempt the request using the current access token
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    // If we receive a 401 (token expired), try to refresh the token and retry once
    if (error.response && error.response.status === 401) {
      console.log('Access token expired. Attempting silent refresh...');
      
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry the request one time with the new access token
        const retryResponse = await axios.get(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        return retryResponse.data;
      }
    }
    // If it's another error or refresh failed, throw the error to the component
    throw error;
  }
};
