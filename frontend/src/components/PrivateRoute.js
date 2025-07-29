// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

// Professional, accessible loading spinner
const CenteredSpinner = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
    }}
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="spinner" aria-label="Loading…"></div>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // 1. Show spinner while loading initial auth state (first mount)
  if (loading) return <CenteredSpinner />;

  // 2. If authenticated, render the protected content
  if (isAuthenticated) return children;

  // 3. If not, redirect to login. Optionally, could set state so user is returned after login
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
